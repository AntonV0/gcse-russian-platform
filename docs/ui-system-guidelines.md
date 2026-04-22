# UI System Guidelines

This document defines the visual and interaction standards for the GCSE Russian Course Platform.

It ensures consistency across Admin, Student, and Teacher experiences, while maintaining a premium, modern, and engaging interface suitable for students aged 12–16 and their parents.

---

## 1. Design Philosophy

The UI should feel:

- **Premium** – clean, structured, and high-quality
- **Approachable** – not overly corporate or cold
- **Educational** – clear, readable, and focused
- **Engaging (lightly)** – subtle colour, feedback, and interaction
- **Consistent** – predictable patterns across all pages

This is NOT a playful gamified app, but it should not feel sterile.

---

## 2. Visual Tone

### Balance

We aim for:

- Structure (Notion, Linear)
- Polish (Stripe)
- Approachability (Duolingo – toned down)

### Avoid

- Excessive bright colours
- Overuse of gradients
- Cluttered UI
- Too many badges or pills
- Heavy animations

---

## 3. Typography

Typography must prioritise readability across both **English and Russian**.

### Principles

- Clear hierarchy (title → section → body → meta)
- Comfortable line height
- Slightly softer tone (not ultra-condensed or harsh)

### Usage

- Large headings: strong, confident, not aggressive
- Body text: highly readable, neutral tone
- Labels/meta: subtle, secondary emphasis

---

## 4. Colour Usage

Colour should be:

- Purposeful
- Consistent
- Limited in scope

### Roles

- **Primary (brand blue)** → actions, focus states
- **Success / warning / error** → feedback only
- **Neutral tones** → layout, surfaces, text

### Guidelines

- Do not mix too many colours in one view
- Prefer **tint-based backgrounds** over solid fills
- Use colour to guide attention, not decorate randomly

---

## 5. Spacing & Layout

Spacing should create clarity and hierarchy.

### Rules

- Use consistent spacing scale (no random values)
- Prefer breathing room over density
- Group related elements visually

### Layout Patterns

- Page → Sections → Cards → Content
- Avoid deep nesting where possible

---

## 6. Surfaces (Cards, Panels)

Surfaces define structure.

### Principles

- Soft elevation (not heavy shadows)
- Subtle borders
- Rounded corners (consistent radius)
- Clean internal spacing

### Avoid

- Over-layering cards inside cards
- Excessive shadow usage

---

## 7. Components

### Rule

**Do NOT build one-off UI if a shared component exists.**

Always prefer:

- Button
- Card / Panel
- Badge
- Input / Select / Textarea
- Table
- Navigation components

---

## 8. Composition Patterns (IMPORTANT)

Pages should be built from reusable patterns, not raw elements.

Examples:

- Page header (title + description)
- Section block (title + content)
- Card grid (index pages)
- Inspector panel (admin editing)
- Toolbar + filters
- Empty state
- Locked content prompt

These patterns should be reused across the platform.

---

## 9. Interaction & Feedback

### Use subtle motion

- Hover states
- Focus states
- Press states
- Expand/collapse transitions

### Avoid

- Large animations
- Delayed interactions
- Distracting motion

### Goal

Make the interface feel **responsive and alive**, not animated.

---

## 10. Icons

- Use consistent icon set (Lucide)
- Keep sizes consistent
- Do not mix icon styles
- Use icons to support meaning, not replace text

---

## 11. Content Tone

Especially important for students:

- Clear
- Encouraging
- Direct
- Not overly formal

Avoid:

- jargon
- overly technical wording
- corporate tone

---

## 12. Admin vs Student UI

### Admin

- Slightly denser
- More functional
- Clear hierarchy
- Minimal decoration

### Student

- Slightly more visual
- More spacing
- More feedback (progress, states)
- More warmth in tone

---

## 13. Consistency Rule

If a pattern already exists:

- reuse it
- do not redesign it per page

If a better version is created:

- update the shared component
- do not fork variants

---

## 14. UI Lab Role

The UI Lab is:

- a **reference environment**
- a **testing ground**
- a **design system preview**

It is NOT:

- the source of truth for styling logic

All real styling should live in:

- shared components
- shared patterns

---

## 15. Definition of “Done UI”

A UI element is complete when:

- it matches existing patterns
- it uses shared components
- spacing is consistent
- states are defined (hover, active, disabled)
- it works in real pages, not just UI Lab

---
