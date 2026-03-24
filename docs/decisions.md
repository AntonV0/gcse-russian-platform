# Architecture Decisions

This document captures key technical decisions made during the development of the GCSE Russian Course Platform.

---

## 1. Why a metadata-driven question engine?

### Decision

Questions are stored in the database with flexible metadata rather than using a rigid schema for every interaction type.

### Why

The platform needs to support multiple question experiences, including:

- multiple choice
- short answer
- translation
- selection-based answers
- sentence builder
- listening mode behaviour

A metadata-driven approach allows these behaviours to be configured without creating a separate rendering system for every new variation.

### Benefits

- easier to extend
- fewer hardcoded UI branches
- reusable rendering logic
- content model stays flexible as the platform grows

### Tradeoff

This increases complexity in the transformation/rendering layer and requires careful validation of metadata structure.

---

## 2. Why use a block-based lesson system?

### Decision

Lessons are built from reusable content blocks instead of being hardcoded page-by-page.

### Why

The course needs a repeatable structure for educational content while still allowing variety across lessons.

### Benefits

- faster lesson creation
- consistent layout and UX
- easier to maintain
- supports future lesson types without rewriting page structure

### Tradeoff

Block systems require good conventions to avoid becoming too loose or inconsistent.

---

## 3. Why separate question sets from lessons?

### Decision

Question sets are stored as reusable content entities, separate from lesson definitions.

### Why

The same question set may need to be:

- used inside lessons
- assigned as homework
- reused in templates
- duplicated and modified for new content

### Benefits

- reusable content
- cleaner separation of concerns
- easier admin tooling
- better long-term scalability

### Tradeoff

This introduces more relational complexity than embedding questions directly inside lesson files.

---

## 4. Why use Supabase with Row Level Security?

### Decision

Supabase is used for database, auth, storage, and security policies.

### Why

The platform needs:

- authenticated users
- role-aware access
- private uploads
- database-backed content and progress tracking

RLS allows access control to live close to the data layer rather than relying only on frontend checks.

### Benefits

- stronger security model
- clear separation of read/write permissions
- scalable for multi-role system design

### Tradeoff

RLS adds setup complexity and requires careful debugging when permissions interact with application-level auth logic.

---

## 5. Why keep admin overrides separate from role labels?

### Decision

Admin access is determined by `profiles.is_admin`, not by the general `role` field.

### Why

In this system, the simple role label was not reliable enough to describe all behaviour. Admin needed to be treated as an explicit privilege override.

### Benefits

- clearer source of truth for admin permissions
- avoids ambiguity between admin, teacher, and student logic
- easier to use in route guards and helper functions

### Tradeoff

It creates a split between display-level role information and permission-level admin access, which must be kept clear in the codebase.

---

## 6. Why build a custom admin CMS instead of writing directly to the database?

### Decision

A custom admin interface was built for question sets and question content instead of relying on direct database editing.

### Why

Writing structured educational content directly in SQL or through the Supabase dashboard is slow, error-prone, and not scalable.

### Benefits

- much faster content creation
- safer workflows
- fewer broken relationships
- easier duplication, reordering, templating, and visibility management

### Tradeoff

Building admin tooling takes longer up front, but pays off heavily in content production speed.

---

## 7. Why add a template system?

### Decision

Question sets can be marked as templates and reused to create new working sets.

### Why

Many educational activities repeat the same structure with different prompts, vocab, or metadata.

Examples:

- translation text input
- selection-based translation
- sentence-builder translation
- listening tasks

### Benefits

- standardises authoring
- speeds up content production
- reduces setup mistakes
- makes common patterns reusable

### Tradeoff

Templates add more admin complexity and require naming conventions to stay organised.

---

## 8. Why use server actions for admin workflows?

### Decision

Admin write operations use server actions rather than client-side mutation patterns.

### Why

These flows are tightly coupled to authenticated writes, redirects, and secure server-side logic.

### Benefits

- simpler mental model
- keeps sensitive logic server-side
- integrates well with App Router
- good fit for forms and admin CRUD flows

### Tradeoff

Complex form interactivity sometimes still requires client components layered on top.

---

## 9. Why create a type-aware admin form?

### Decision

The question editor was refactored so irrelevant sections hide automatically depending on question type and answer strategy.

### Why

A single large generic form made content authoring slower and more error-prone.

### Benefits

- cleaner authoring experience
- fewer mistakes
- easier to work with selection-based and sentence-builder content
- better long-term usability for real content production

### Tradeoff

This introduces extra UI state handling and slightly more complexity in the form layer.

---

## 10. Why support both application-level auth and helper-level admin bypasses?

### Decision

The project uses both route guards and helper-level admin-aware query logic.

### Why

Some pages may allow access at the route level, but still rely on data helpers that filter by teacher/student memberships.

Admin needs visibility across the system, even where normal user helpers are group-scoped.

### Benefits

- preserves teacher/student behaviour
- gives admin full operational visibility
- avoids duplicating whole page implementations

### Tradeoff

Permission logic must be carefully aligned across route guards, helper functions, and RLS policies.

---

## 11. Why keep course content partly file-driven and question content DB-driven?

### Decision

Lesson block structure remains file-driven, while question sets and related interactive content are database-driven.

### Why

The platform needs both:

- stable, structured lesson content
- flexible, reusable interactive content

### Benefits

- lessons remain easy to version and structure in code
- questions remain reusable and admin-manageable
- avoids forcing all content into a single system too early

### Tradeoff

This hybrid approach is more complex than using only one content model.

---

## 12. Why prioritise architecture before feature expansion?

### Decision

The project focused on strong foundations before advanced features like AI marking or speaking workflows.

### Why

The platform needs a reliable structure before adding expensive or complex features.

### Benefits

- stronger long-term maintainability
- easier future expansion
- less rework later

### Tradeoff

Some user-facing features arrive later, but on a better foundation.
