# Architecture Overview

This document outlines the system architecture of the GCSE Russian Course Platform.

---

## 🧩 High-Level System Architecture

```mermaid
flowchart TD

  U[User] --> R{Role}

  R -->|Student| SD[Student Dashboard]
  R -->|Teacher| TD[Teacher Dashboard]
  R -->|Admin| AD[Admin Panel]

  SD --> C[Courses]
  SD --> A1[Assignments]
  SD --> P[Progress]

  TD --> TG[Teaching Groups]
  TD --> TA[Assignments]
  TD --> TR[Submission Review]

  AD --> QS[Question Sets]
  AD --> Q[Questions]
  AD --> TMP[Templates]

  C --> CV[Course Variant]
  CV --> M[Modules]
  M --> L[Lessons]

  L --> LB[Lesson Blocks]
  LB --> TXT[Text / Notes / Vocab]
  LB --> QS2[Question Set Block]

  QS2 --> QSE[Question Engine]

  QSE --> MCQ[Multiple Choice]
  QSE --> SA[Short Answer]
  QSE --> TRN[Translation]
  QSE --> SB[Sentence Builder]
  QSE --> SEL[Selection Based]

  QSE --> VAL[Validation Engine]
  QSE --> AU[Audio System]

  A1 --> SUB[Submission System]
  SUB --> FB[Feedback]

  SUB --> ST[(Supabase Storage)]
  QSE --> DB[(Supabase DB)]
  C --> DB
  A1 --> DB
```

---

## 🗄️ Database Relationships

```mermaid
erDiagram

  COURSES ||--o{ COURSE_VARIANTS : has
  COURSE_VARIANTS ||--o{ MODULES : has
  MODULES ||--o{ LESSONS : has

  QUESTION_SETS ||--o{ QUESTIONS : contains
  QUESTIONS ||--o{ QUESTION_OPTIONS : has
  QUESTIONS ||--o{ QUESTION_ACCEPTED_ANSWERS : has

  ASSIGNMENTS ||--o{ ASSIGNMENT_ITEMS : contains
  ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives

  TEACHING_GROUPS ||--o{ TEACHING_GROUP_MEMBERS : has

  LESSONS ||--o{ ASSIGNMENT_ITEMS : may_reference
  QUESTION_SETS ||--o{ ASSIGNMENT_ITEMS : may_reference
```

---

## 🧠 Key Architectural Decisions

### Metadata-driven question system

Questions are defined using flexible metadata rather than rigid schemas, allowing:

- multiple answer strategies
- easy extension
- reusable UI components

---

### Block-based lesson design

Lessons are composed of reusable blocks:

- improves consistency
- simplifies content creation
- allows future expansion

---

### Role-based access with Supabase RLS

- Student, Teacher, Admin roles
- Admin override logic for management views
- Secure data isolation

---

### Template system

- Standardises question creation
- Speeds up content production
- Reduces duplication errors

---

## ⚙️ Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Server Actions
