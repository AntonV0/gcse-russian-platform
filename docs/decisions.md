# Architecture Decisions

This document records the main technical decisions behind the GCSE
Russian Course Platform.

It focuses on decisions that materially shaped the system, not every
implementation detail.

This version includes:

- lesson builder CMS evolution
- platform UI and dashboard decisions
- variant-based content architecture
- shared section system
- UI Lab system and component architecture

---

## 1. Why build one platform instead of separate student apps?

### Decision

Use a single platform with shared architecture and differentiate experiences via access + UI.

### Why

Supports:

- trial
- self-study
- Volna

### Benefits

- one codebase
- shared systems

---

## 2. Why separate role from access mode?

### Decision

Role ≠ access mode

### Why

A student is still a student across modes.

---

## 3. Why use a block-based lesson system?

### Decision

Lessons use reusable blocks.

### Benefits

- scalable
- flexible

---

## 4. Why move lessons to DB-driven architecture?

### Decision

Remove hardcoded content.

### Benefits

- CMS-driven
- no code needed for content

---

## 5. Why introduce section-based lessons?

### Decision

Lesson → Section → Block

### Benefits

- structured learning
- progression

---

## 6. Why use visit-based progression?

### Decision

Track visits, not completion.

---

## 7. Why build a custom CMS?

### Decision

Internal builder instead of external CMS.

---

## 8. Why introduce variant-based content system?

### Decision

Replace track/delivery with a single field:

- variant_visibility

Values:

- shared
- foundation_only
- higher_only
- volna_only

### Why

- matches real product (variants)
- simplifies logic

### Benefits

- cleaner architecture
- easier rendering logic

---

## 9. Why introduce canonical section keys?

### Decision

Add canonical_section_key to sections.

### Why

- support shared content across variants

### Benefits

- future progress syncing
- reuse without coupling

---

## 10. Why keep variants separate but reusable?

### Decision

Foundation, Higher, Volna are independent variants.

### Why

- different structures
- but overlapping content

### Result

- reuse via canonical keys
- not shared lesson instances

---

## 11. Why shift builder UX to creation-first?

### Decision

Prioritise block creation in UI.

---

## 12. Why introduce access-aware navigation?

### Decision

UI adapts to access mode.

---

## 13. Why separate UI visibility from backend auth?

### Decision

Frontend controls UX, backend controls access.

---

## 14. Why introduce dashboard orchestration?

### Decision

Central helper aggregates user state.

---

## 15. Why introduce next-step system?

### Decision

Guide users dynamically.

---

## 16. Why use preset avatars?

### Decision

Use avatar_key instead of uploads.

---

## 17. Why introduce a UI Lab system?

### Decision

Build a dedicated UI Lab to design and validate components before using them in production pages.

### Why

- prevents inconsistent UI patterns
- avoids ad-hoc component creation
- allows safe iteration on design system

### Benefits

- consistent UI across admin, student, and teacher areas
- faster future development
- clearer component boundaries

---

## 18. Why use Dev Component Markers?

### Decision

Attach a development-only marker to all shared UI components.

### Why

- makes component usage visible in the UI
- helps identify duplication and missing abstractions

### Benefits

- enforces reuse
- improves maintainability
- accelerates UI refactoring

---

## 19. Why replace raw table markup with a table system?

### Decision

Introduce a reusable table architecture:

- TableShell
- TableToolbar
- DataTable components

### Why

Raw tables led to:

- duplication
- inconsistent styling
- unpredictable behaviour

### Benefits

- consistent structure across admin pages
- reusable patterns
- easier future enhancements (sorting, filtering, pagination)

---

## 20. Why treat tables and hierarchy as separate patterns?

### Decision

Support both:

- table layouts
- hierarchical list layouts

### Why

Different data needs different representation:

- tables → comparison
- hierarchy → structure

### Benefits

- clearer UX
- better alignment with LMS data (modules → lessons → blocks)

---

## 21. Why introduce structured row interaction patterns?

### Decision

Define consistent row states and behaviours:

- default
- hover
- selected
- disabled

### Why

Previously:

- row behaviour varied per page

### Benefits

- predictable UX
- easier component reuse
- cleaner interaction model

---

## 22. Why prioritise architecture first?

### Decision

Build strong foundations before features.

---

## 23. Theme System Design

### Decision

Implement a three-mode theme system (Light, Dark, System) using a client-side ThemeProvider and CSS variables.

### Rationale

- Avoid SSR hydration issues
- Enable system preference syncing
- Provide consistent UX across pages
- Prepare for future colour theme extensibility

### Key Choices

- Store preference in localStorage (not DB initially)
- Use `data-theme` attribute instead of class toggling
- Separate theme preference from resolved theme
- Keep header toggle as quick override
- Use CSS variables instead of hardcoded colours

### Trade-offs

- Requires discipline to avoid hardcoded colours
- Initial UI may mix token-based and hardcoded values (to be refactored)

### Future Work

- Token cleanup across UI
- Accent colour themes
- Persist preferences to user profile

---

## 24. Why introduce marketing and platform route groups?

### Decision

Use Next.js App Router route groups to separate:

- marketing pages in `(marketing)`
- authenticated LMS pages in `(platform)`

while preserving clean URLs.

### Why

The product needs to support:

- `www.gcserussian.com` for public marketing and SEO pages
- `app.gcserussian.com` for the LMS platform in future
- one codebase during the current phase

### Key Choices

- Keep `/pricing` as a public, trial-first marketing page.
- Move authenticated Stripe checkout and upgrade UI to `/account/billing`.
- Keep platform pages inside the authenticated platform layout with `PlatformSidebar`.
- Keep marketing pages inside a separate public layout with marketing-only header and footer.
- Do not implement middleware or subdomain routing yet.

### Result

Public pages can grow independently from platform workflows, and future subdomain routing can map domains to route groups without changing visible URLs.
