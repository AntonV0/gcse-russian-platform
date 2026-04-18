# Architecture Decisions

This document records the main technical decisions behind the GCSE
Russian Course Platform.

It focuses on decisions that materially shaped the system, not every
implementation detail.

This version has been **expanded to include lesson builder UX and CMS
evolution decisions from the latest development phase**, as well as
**platform UI, dashboard, and account system decisions**.

---

## 1. Why build one platform instead of separate student apps?

### Decision

Use a single platform with shared architecture and differentiate student
experiences through access rules, permissions, and UI behaviour.

### Why

The product needs to support multiple student experiences:

- trial
- self-study / full access
- Volna student

It would be too costly and fragile to maintain separate apps for each
one.

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

### Why

Off-the-shelf CMS tools do not support:

- structured lesson blocks
- question engine integration
- assignment workflows

### Benefits

- full control
- tailored UX
- faster iteration

---

## 7. Why move lesson system to fully DB-driven architecture? (EXPANDED)

### Decision

Remove all hardcoded lesson templates and move to DB-driven content.

### Why

- lessons must be created without code
- content must scale rapidly
- admin users need full control

### Benefits

- dynamic lesson rendering
- CMS-driven workflows
- reusable structures

### Tradeoff

- requires strong schema + validation discipline

---

## 8. Why introduce section-based lesson architecture?

### Decision

Add **Lesson → Section → Block** hierarchy.

### Why

- long lessons became unmanageable
- need for structured progression
- foundation for step-based UX

### Benefits

- improved pacing
- scalable lesson structure
- better student experience

### Tradeoff

- additional complexity in logic and UI

---

## 9. Why use visit-based progression instead of completion-based?

### Decision

Track progression via **section visits**.

### Why

- avoids friction
- aligns with real user behaviour
- simpler UX

### Benefits

- smooth navigation
- predictable behaviour
- easier DB tracking

### Tradeoff

- does not measure mastery

---

## 10. Why build a full lesson builder CMS?

### Decision

Introduce a dedicated lesson builder in admin.

### Why

- manual lesson coding is not scalable
- content creation must be accessible

### Benefits

- visual editing
- drag-and-drop structure
- faster iteration

### Tradeoff

- complex admin UI
- requires careful UX design

---

## 11. Why remove hardcoded presets/templates?

### Decision

Delete static preset files and move to DB.

### Why

- duplicated logic
- inflexible system

### Benefits

- single source of truth
- dynamic presets

---

## 12. Why use position-based ordering instead of nested structures?

### Decision

Use numeric position fields.

### Why

- simpler queries
- predictable ordering

### Benefits

- easy drag-and-drop support
- no tree complexity

### Tradeoff

- requires reorder logic

---

## 13. Why shift lesson builder UX to "creation-first"? (NEW)

### Decision

Redesign builder so **block creation is primary**, not secondary.

### Before

- list-first UI
- creation hidden below content

### After

- creation at top
- clear entry point

### Why

- most common action = adding content
- reduces friction for authors

### Benefits

- faster content creation
- clearer workflow
- better onboarding

---

## 14. Why group block types in the composer? (NEW)

### Decision

Group blocks into:

- Structure
- Teaching
- Media
- Practice

### Why

- flat lists do not scale
- improves discoverability

### Benefits

- faster selection
- better mental model

---

## 15. Why use selection-driven inline forms? (NEW)

### Decision

Show form only after selecting block type.

### Why

- reduces visual clutter
- focuses user attention

### Benefits

- cleaner UI
- guided workflow

---

## 16. Why redesign draggable block list UX? (NEW)

### Decision

Improve block list with:

- stronger selection state
- better previews
- clearer actions

### Why

- editing existing blocks was slow
- scanning content was difficult

### Benefits

- faster navigation
- better usability
- clearer structure

---

## 17. Why prioritise UX improvements at this stage?

### Decision

Invest in UX after core architecture is stable.

### Why

- architecture was already solid
- biggest bottleneck became usability

### Benefits

- higher productivity
- better content quality
- scalable authoring system

---

## 18. Why introduce an access-aware sidebar system? (NEW)

### Decision

Build a sidebar that dynamically adapts based on role and access mode.

### Why

- different student types require different navigation
- avoids confusing users with irrelevant features
- supports product funnel (trial → full → Volna)

### Benefits

- cleaner UX
- clearer user journeys
- scalable navigation system

### Tradeoff

- requires consistent access logic across UI

---

## 19. Why separate UI visibility from backend permissions? (NEW)

### Decision

Introduce a UI-level access layer separate from backend authorization.

### Why

- backend controls access
- UI controls experience

These are different concerns.

### Benefits

- flexible UI behaviour
- easier iteration on UX
- avoids duplication of logic

### Tradeoff

- requires careful coordination between layers

---

## 20. Why introduce a dashboard orchestration layer? (NEW)

### Decision

Use a central dashboard helper to aggregate:

- role
- track
- access mode
- progress

### Why

- dashboard needs combined state
- avoids duplicating logic in components

### Benefits

- single source of truth for UI decisions
- cleaner component structure
- easier future expansion

---

## 21. Why introduce a “next-step” system (V1)? (NEW)

### Decision

Provide dynamic guidance based on:

- access mode
- track
- progress

### Why

- users need direction, not just navigation
- reduces decision friction

### Benefits

- improved engagement
- clearer onboarding
- better learning flow

### Tradeoff

- currently simplified (no exact lesson tracking yet)

---

## 22. Why use preset avatars instead of uploads? (NEW)

### Decision

Use `avatar_key` with predefined avatars.

### Why

- target audience includes younger students (12–16)
- avoids moderation and storage complexity
- ensures consistent UI

### Benefits

- safe
- simple
- scalable

### Tradeoff

- less personalisation than uploads

---

## 23. Why integrate Online Classes into the platform? (NEW)

### Decision

Add Online Classes page as a bridge to Volna School.

### Why

- supports conversion funnel
- connects self-study users to teacher-led offering

### Benefits

- monetisation pathway
- unified ecosystem

### Tradeoff

- must hide for Volna users to avoid redundancy

---

## 24. Why fix admin access to bypass restrictions? (NEW)

### Decision

Ensure admins always have full access regardless of track/access state.

### Why

- admin must be able to view all content
- avoids false restriction bugs

### Benefits

- reliable admin experience
- easier debugging and content management

---

## 25. Why prioritise architecture before features?

### Decision

Build strong foundations first.

### Why

- prevents rework

### Benefits

- scalable system
- easier future features

---

## 26. Next architectural direction

- true lesson continuation system
- module-level progress tracking
- autosave builder
- inline block insertion
- richer block system
- analytics
- speaking workflows
- payments integration
