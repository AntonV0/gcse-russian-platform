# GCSE Russian Course Platform

An online learning platform for GCSE Russian students, designed to deliver structured courses, interactive lessons, and exam preparation.

---

## 🚀 Overview

This project powers the course platform behind **gcserussian.com**, with a focus on:

* Structured course delivery (modules → lessons)
* Reusable lesson content system
* User authentication and access control
* Progress tracking
* Scalable architecture for future products

---

## 🧠 Core Concepts

### Course Structure

The platform is built around a hierarchical model:

* **Course**
* **Variant** (e.g. Foundation, Higher)
* **Module**
* **Lesson**

### Example URL structure

```
/courses/[courseSlug]
/courses/[courseSlug]/[variantSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]/lessons/[lessonSlug]
```

---

## 🔐 Access Model

User access is controlled via the `user_course_access` table.

Each user has:

* `course_slug`
* `course_variant`
* `access_mode`

### Access modes

* `trial` → access to free lessons only
* `full` → full course access
* `volna` → future teacher/student mode

Lesson-level access is defined in course data:

```ts
access: "free" | "paid"
```

---

## 📊 Progress Tracking

Lesson progress is stored in `lesson_progress`.

Tracked fields:

* `course_slug`
* `variant_slug`
* `module_slug`
* `lesson_slug`
* `completed`

Progress is:

* shown in modules
* summarised on dashboard
* updated via server actions

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Backend / DB:** Supabase (Postgres + Auth)
* **Deployment:** Vercel

---

## 🗂️ Project Structure

```
src/
  app/
    (public)/
    (platform)/
      dashboard/
      courses/
        [courseSlug]/
          [variantSlug]/
            modules/
              [moduleSlug]/
                lessons/
                  [lessonSlug]/

  components/
    layout/
    ui/
    lesson-blocks/

  lib/
    course-data.ts
    course-helpers.ts
    lesson-content/
    routes.ts
    access.ts
    progress.ts
    progress-module.ts
    auth.ts
    supabase/

  types/
    course.ts
    lesson.ts
```

---

## 🧩 Lesson System

Lessons are built using a **block-based architecture**.

Each lesson consists of reusable blocks such as:

* text
* vocabulary
* notes
* questions
* audio (future)

Lesson content is stored separately from UI using:

```
lib/lesson-content/
```

This allows fast content creation without changing components.

---

## 🔁 Routing System

All navigation is handled through helper functions in:

```
src/lib/routes.ts
```

Examples:

```ts
getLessonPath(courseSlug, variantSlug, moduleSlug, lessonSlug)
getModulePath(courseSlug, variantSlug, moduleSlug)
getVariantPath(courseSlug, variantSlug)
```

---

## 🧪 Development Workflow

### Branching

* `main` → production (public)
* `dev` → development (used with Vercel preview deployments)

### Workflow

1. Work on `dev`
2. Push changes → preview deployment
3. Test in preview
4. Merge to `main` when ready

---

## 🔧 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do **not** commit real values.

---

## ☁️ Deployment

The app is deployed using **Vercel**.

* Production → from `main`
* Preview → from `dev` branch

---

## 🛣️ Future Plans

* Multiple course variants (Foundation, Higher)
* Volna School integration (teacher mode)
* Speaking exam preparation
* Mock exam system
* AI-assisted learning features
* Audio / listening exercises

---

## ⚠️ Notes

* Supabase uses Row Level Security (RLS)
* All access control is enforced server-side
* Progress tracking is variant-aware

---

## 🧑‍💻 Author

Anton Vlasenko - Director of Volna Online Russian School.

Built as part of the Volna School ecosystem.

---
