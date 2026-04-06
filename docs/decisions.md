# Architecture Decisions

This document records the main technical decisions behind the GCSE Russian Course Platform.

It focuses on decisions that materially shaped the system, not every implementation detail.

---

## 1. Why build one platform instead of separate student apps?

### Decision

Use a single platform with shared architecture and differentiate student experiences through access rules, permissions, and UI behaviour.

### Why

The product needs to support multiple student experiences:

- trial
- self-study / full access
- Volna student

It would be too costly and fragile to maintain separate apps for each one.

### Benefits

- one codebase
- one content model
- shared progress logic
- easier long-term maintenance

### Tradeoff

Access logic becomes more important and must be documented clearly, because the same role can appear in different product experiences.

---

## 2. Why separate role from access mode?

### Decision

Treat role and access mode as different concerns.

### Why

A student is still a student whether they are:

- trial
- self-study
- Volna

Teacher and admin permissions solve different problems than course visibility and student UX behaviour.

### Benefits

- cleaner mental model
- clearer permission design
- avoids forcing product logic into a role field

### Tradeoff

The documentation and diagrams must reflect two axes instead of one.

---

## 3. Why use a metadata-driven question engine?

### Decision

Questions are stored with structured metadata rather than a rigid schema for each behaviour type.

### Why

The platform needs to support multiple interaction styles without rewriting the UI system each time.

Examples include:

- multiple choice
- short answer
- translation
- selection-based answers
- sentence builder behaviour
- listening mode configuration

### Benefits

- easier to extend
- fewer hardcoded branches
- reusable rendering logic
- flexible authoring model

### Tradeoff

More complexity is pushed into transformation, validation, and runtime interpretation.

---

## 4. Why use a block-based lesson system?

### Decision

Lessons are built from reusable blocks instead of hardcoded pages.

### Why

The course needs repeatable structure with controlled variety across many lessons.

### Benefits

- consistent content layout
- faster lesson creation
- easier maintenance
- future expansion without rewriting lesson pages

### Tradeoff

Block systems need conventions to stay coherent and not become too loose.

---

## 5. Why separate question sets from lessons?

### Decision

Question sets are reusable entities, not embedded directly into lesson definitions.

### Why

The same question set may be used:

- inside a lesson
- in homework
- as a template source
- as a duplicated starting point for new content

### Benefits

- reuse
- cleaner content boundaries
- stronger admin workflows
- better scalability

### Tradeoff

The relational model becomes more complex than embedding all interactive content directly in one place.

---

## 6. Why build a custom admin CMS?

### Decision

Use a custom admin interface for question authoring and platform content management instead of direct database editing.

### Why

Educational content management is too complex and repetitive to be handled safely through raw SQL or dashboard editing alone.

### Benefits

- faster content production
- fewer relationship mistakes
- template support
- duplication and reordering workflows
- usage visibility
- safer operational control for users, groups, and access

### Tradeoff

Admin tooling takes longer to build initially.

---

## 7. Why add a template system?

### Decision

Question sets can be marked as templates and used to generate new working sets.

### Why

Many educational activities reuse the same structural pattern with different prompts, vocabulary, or metadata.

### Benefits

- faster authoring
- less setup repetition
- fewer mistakes
- standardised content patterns

### Tradeoff

Templates add organisational complexity and need clear naming and maintenance discipline.

---

## 8. Why use Supabase with Row Level Security?

### Decision

Use Supabase for database, auth, storage, and access policies.

### Why

The platform needs:

- authenticated users
- private uploads
- role-aware access
- secure write rules
- scalable content and progress storage

### Benefits

- strong security model
- one integrated backend stack
- clearer access control close to the data layer

### Tradeoff

RLS increases debugging complexity, especially when combined with application-level permission helpers.

---

## 9. Why keep admin access as an explicit privilege override?

### Decision

Admin access is determined by `profiles.is_admin`, not just a general role label.

### Why

Admin behaviour in this platform is a system-level override, not simply another everyday user role.

### Benefits

- clearer source of truth
- easier permission checks
- less ambiguity between teacher and admin behaviour

### Tradeoff

There is a distinction between display-level role descriptions and permission-level admin handling.

---

## 10. Why add an explicit teacher role field?

### Decision

Use `profiles.is_teacher` as the primary teacher-role flag, while still keeping `teaching_group_members.member_role` for group membership context.

### Why

Inferring teacher status only from group membership or heuristics is fragile and makes admin tooling harder to reason about.

### Benefits

- cleaner teacher detection
- better student/teacher filtering
- simpler teaching-group assignment UI
- clearer role management from admin

### Tradeoff

Role and group membership now need to stay conceptually separate in documentation and helper logic.

---

## 11. Why use server actions for operational workflows?

### Decision

Use server actions for admin and assignment write flows.

### Why

These workflows are tightly tied to authenticated writes, redirects, and secure server-side logic.

### Benefits

- keeps sensitive logic on the server
- good fit with App Router
- simpler write flow for forms and operational tooling

### Tradeoff

Interactive form UX still requires client components layered on top.

---

## 12. Why derive teacher assignment state from submissions?

### Decision

Teacher-facing assignment state is derived from submission data rather than trusted from assignment status alone.

### Why

Operational review state matters more to teachers than publication state.

A published assignment may still be:

- awaiting first submission
- awaiting review
- fully reviewed

### Benefits

- more accurate teacher views
- better prioritisation
- clearer workload signals

### Tradeoff

Requires aggregate helper logic rather than a single flat field.

---

## 13. Why separate status from due date urgency?

### Decision

Treat workflow state and deadline urgency as separate UI signals.

### Why

They answer different questions:

- status → where is this in the workflow?
- due date urgency → how urgent is this now?

### Benefits

- clearer scanning
- less ambiguity
- reusable UI rules across student and teacher pages

### Tradeoff

Slightly more helper and UI logic.

---

## 14. Why lock student submissions after review?

### Decision

Reviewed submissions become locked on the student side.

### Why

For this platform, reviewed work should feel completed unless a teacher intentionally reopens it.

### Benefits

- clearer workflow
- avoids accidental overwriting
- makes teacher review meaningful
- matches exam-style expectations more closely

### Tradeoff

Teachers need a reopening action for revision loops.

---

## 15. Why add a teacher reopen action?

### Decision

Teachers can reopen a reviewed submission instead of allowing unlimited student overwrites.

### Why

This preserves review integrity while still allowing another submission round when needed.

### Benefits

- controlled resubmission workflow
- better teacher oversight
- preserves a clearer review lifecycle

### Tradeoff

Still only preserves the latest state; a true audit trail would require an event history table later.

---

## 16. Why support ordered mixed assignment items?

### Decision

Assignments store ordered items across multiple item types instead of grouping lessons, question sets, and tasks separately.

### Why

The learning experience depends on sequence, not just membership.

Teachers need to define flows such as:

- lesson
- question set
- custom written task

### Benefits

- true assignment sequencing
- better student guidance
- scalable to more item types later

### Tradeoff

Form and action logic become more structured than simple grouped arrays.

---

## 17. Why assemble assignment progress from existing systems?

### Decision

Assignment item progress is derived from lesson and question activity rather than stored as a completely separate new system.

### Why

The platform already tracks:

- lesson completion
- question attempts
- question progress

Reusing those systems keeps the design simpler.

### Benefits

- less duplication
- progress remains close to source-of-truth activity
- easier to evolve in stages

### Tradeoff

Assignment progress needs helper logic because it is composed from multiple sources.

---

## 18. Why keep progress separate from access grants?

### Decision

Do not tie historical progress deletion or rewriting to access-grant switching.

### Why

Students may move between trial, full, and Volna access, or between Foundation and Higher, without the platform losing their older work history.

### Benefits

- safer admin operations
- reversible access changes
- variant-aware progress history remains intact
- less risk of destructive state changes

### Tradeoff

Admin pages need clearer visibility into active access, inactive access history, and per-variant progress.

---

## 19. Why use contextual admin navigation for content?

### Decision

Use context-first navigation for admin content management instead of flat global tabs.

### Why

Content entities such as variants, modules, and lessons make more sense when seen inside their parent course and variant context.

### Benefits

- clearer mental model
- safer editing and ordering
- better fit for reusable but hierarchically presented content
- easier future extension to lesson authoring

### Tradeoff

Deep route nesting is more complex than a flat admin table approach.

---

## 20. Why add reusable admin feedback and confirmation components?

### Decision

Use shared admin feedback banners and confirmation buttons rather than hand-rolling action messaging on every page.

### Why

Operational admin tooling needs consistent success/error visibility and safer destructive actions.

### Benefits

- more consistent admin UX
- lower duplication
- safer remove/deactivate flows
- easier to extend across the CMS

### Tradeoff

Slightly more component infrastructure for internal tooling.

---

## 21. Why keep content partly file-driven and partly DB-driven for now?

### Decision

Lesson structure remains partly file-driven while reusable interactive content is database-driven.

### Why

The platform needs both:

- stable structured lesson content
- reusable admin-manageable interactive content

### Benefits

- lessons remain easy to version in code
- question content remains reusable and manageable
- avoids forcing everything into one model too early

### Tradeoff

The overall content architecture is hybrid, which is more complex than a single-system approach.

---

## 22. Why avoid premature restructuring of `lib/`?

### Decision

Keep helper structure stable during active feature development.

### Why

The project is still evolving quickly, and large structural refactors would create churn without immediate product benefit.

### Benefits

- faster feature iteration
- fewer broken imports
- lower implementation risk

### Tradeoff

A future domain-based refactor may still make sense once systems stabilise.

---

## 23. Why prioritise architecture before advanced features?

### Decision

Focus on reusable foundations before adding features such as AI marking, speaking workflows, or deeper analytics.

### Why

The long-term value of the platform depends more on solid structure than on adding impressive but unstable features too early.

### Benefits

- easier extension later
- less rework
- better long-term maintainability

### Tradeoff

Some eye-catching features arrive later, but on a stronger foundation.

---

## 24. Why should the next major step be database-driven lesson authoring?

### Decision

The next major content evolution should be moving lesson authoring and lesson blocks into the database and admin CMS.

### Why

The current hybrid model works for platform foundations, but real course production should not require code changes for each new lesson.

### Benefits

- non-code lesson creation
- easier content scaling
- reusable lesson blocks
- stronger alignment with the question-set authoring model
- cleaner path to modern step-based lesson UX

### Tradeoff

This will require careful schema design, block rendering contracts, and admin authoring UX before large-scale content writing begins.

## 20. Why use visit-based section progression instead of completion buttons?

### Decision

Track lesson progress through **section visits**, not explicit "complete section" actions.

### Why

Requiring users to manually complete each section introduces friction and does not reflect real learning behaviour.

A user who has opened and read a section has meaningfully progressed, even without clicking a button.

### Benefits

- smoother UX (no repetitive actions)
- more natural progression
- better engagement
- avoids fake completion clicks
- simpler mental model for students

### Tradeoff

Visit tracking does not guarantee understanding or mastery.

### Mitigation

- lesson completion remains manual
- future additions can include:
  - quizzes per section
  - checkpoints
  - required interactions

### Future evolution

This system is designed to evolve into:

- true section completion (optional)
- adaptive unlocking
- engagement analytics
