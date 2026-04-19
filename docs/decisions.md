# Architecture Decisions

This document records the main technical decisions behind the GCSE
Russian Course Platform.

It focuses on decisions that materially shaped the system, not every
implementation detail.

This version includes:

- lesson builder CMS evolution
- platform UI and dashboard decisions
- variant-based content architecture (NEW)
- shared section system (NEW)

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

## 8. Why introduce variant-based content system? (NEW)

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

## 9. Why introduce canonical section keys? (NEW)

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

## 17. Why prioritise architecture first?

### Decision

Build strong foundations before features.

---

## 18. Next direction

- cross-variant progress syncing
- upgrade flows (foundation → higher)
- smarter dashboard
