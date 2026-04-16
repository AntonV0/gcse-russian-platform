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

Access logic becomes more important and must be documented clearly.

---

## 2. Why separate role from access mode?

### Decision

Treat role and access mode as different concerns.

### Why

A student is still a student whether they are:

- trial
- self-study
- Volna

### Benefits

- cleaner mental model
- clearer permission design

### Tradeoff

Documentation must reflect two axes.

---

## 3. Why use a metadata-driven question engine?

### Decision

Questions use structured metadata.

### Why

Supports many interaction types without rewriting UI.

### Benefits

- flexible
- reusable

### Tradeoff

More runtime complexity.

---

## 4. Why use a block-based lesson system?

### Decision

Lessons use reusable blocks.

### Why

Enables scalable content.

### Benefits

- consistency
- reuse

### Tradeoff

Needs structure discipline.

---

## 5. Why separate question sets from lessons?

### Decision

Question sets are reusable entities.

### Benefits

- reuse
- scalability

---

## 6. Why build a custom admin CMS?

### Decision

Use internal CMS.

### Benefits

- safer content management
- faster workflows

---

## 7. Why add a template system?

### Decision

Templates generate reusable content.

---

## 8. Why use Supabase with RLS?

### Decision

Use Supabase backend.

---

## 9. Why explicit admin role?

### Decision

profiles.is_admin controls admin.

---

## 10. Why explicit teacher role?

### Decision

profiles.is_teacher used.

---

## 11. Why use server actions?

### Decision

Use server actions for writes.

---

## 12. Why derive assignment state?

### Decision

State from submissions.

---

## 13. Why separate status from urgency?

### Decision

Separate concerns.

---

## 14. Why lock submissions?

### Decision

Lock after review.

---

## 15. Why reopen action?

### Decision

Controlled resubmission.

---

## 16. Why ordered assignment items?

### Decision

Ordered sequence.

---

## 17. Why derived assignment progress?

### Decision

Reuse systems.

---

## 18. Why separate progress from access?

### Decision

Keep independent.

---

## 19. Why contextual admin navigation?

### Decision

Hierarchy-based navigation.

---

## 20. Why visit-based section progression? (UPDATED)

### Decision

Track lesson progress via **section visits**.

### Why

- avoids friction
- reflects real behaviour

### Benefits

- smooth UX
- simple logic
- aligns with DB tracking

### Tradeoff

- not true mastery tracking

### Future

- quizzes
- checkpoints
- analytics

---

## 21. Why introduce section-based lesson architecture?

### Decision

Add **Lesson → Section → Block** hierarchy.

### Why

- long lessons needed structure
- improves pacing
- enables step UX

### Benefits

- scalable lessons
- better UX
- foundation for advanced flows

### Tradeoff

- added complexity

---

## 22. Why move lesson system to DB-driven architecture?

### Decision

Remove hardcoded lesson templates and move fully to DB.

### Why

- no-code lesson creation
- scalability

### Benefits

- CMS-driven content
- reusable structures

### Tradeoff

- requires strong schema design

---

## 23. Why build a full lesson builder CMS?

### Decision

Introduce admin lesson builder.

### Why

- manual coding lessons is not scalable

### Benefits

- drag & drop authoring
- section + block editing
- cross-section movement

### Tradeoff

- more complex admin UI

---

## 24. Why remove hardcoded presets/templates?

### Decision

Delete static preset files.

### Why

- duplicated logic
- limited flexibility

### Benefits

- single source of truth (DB)
- cleaner architecture

---

## 25. Why use position-based ordering instead of nested structures?

### Decision

Use numeric position fields.

### Why

- simpler DB queries
- easier reordering

### Benefits

- predictable ordering
- no tree complexity

### Tradeoff

- requires careful updates on reorder

---

## 26. Why prioritise architecture before features?

### Decision

Build strong foundations first.

### Why

- prevents rework

### Benefits

- scalable system
- easier future features

---

## 27. Next architectural direction

- autosave builder
- richer blocks
- analytics
- speaking system
- payments integration
