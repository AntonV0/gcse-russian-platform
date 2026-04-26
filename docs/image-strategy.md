# Image Strategy

This document defines the first implementation rules for images and visual
placeholders in the GCSE Russian Course Platform.

## Goals

- Support learning and orientation for students aged 12-16.
- Keep the interface premium, calm, and uncluttered.
- Use visuals only where they clarify content, reduce text heaviness, or improve
  motivation.
- Preserve the existing token-based theme system, including light mode, dark
  mode, and future accent colours.
- Avoid adding real image assets until the placeholder and layout system has been
  validated in UI Lab and production pages.

## Current Implementation

- `PageIntroPanel` supports an optional `visual` slot for restrained page-level
  visuals.
- `EmptyState` supports an optional `visual` slot for neutral placeholder or
  future illustration content.
- `VisualPlaceholder` provides token-based placeholder visuals without adding
  image files.
- UI Lab / Lesson Content includes a visual strategy section for reviewing these
  patterns before wider rollout.
- The student vocabulary and grammar hubs use placeholder visuals in their
  intro panels as the first production placement test.
- Past papers and mock exams also use intro placeholders to distinguish official
  resource browsing from platform-created practice without adding visual noise to
  filters or question lists.
- Grammar, past papers, and mock exams use matching empty-state visuals when
  filters return no results. Keep these limited to no-content states so regular
  study views stay focused.

## Placement Rules

Use visuals in:

- marketing and student page intros
- course/module orientation panels
- lesson introductions when context helps comprehension
- vocabulary and grammar topic hubs
- empty states that benefit from warmth or orientation
- image-based practice prompts

Avoid visuals in:

- dense admin tables and inspector forms
- pricing comparison details
- grammar tables and answer feedback blocks
- step trackers and compact navigation
- any place where a visual competes with the primary task

## Style Rules

- Prefer minimal flat illustrations, icon-style graphics, and simple diagrams.
- Use CSS variables and existing tokens for placeholder or SVG colour.
- Keep visual density low and preserve whitespace.
- Do not mix photography and illustration in the same repeated pattern.
- Do not use stock-photo-heavy compositions.
- Give meaningful images alt text. Mark purely decorative visuals as hidden in
  the caller when appropriate.

## Performance Rules

- Use `next/image` for raster assets.
- Use SVG for simple diagrams and reusable illustrations when practical.
- Define stable dimensions or aspect ratios to prevent layout shift.
- Lazy-load images below the fold.
- Keep file sizes small and reuse category visuals across pages.

## First Asset Categories

When real assets are added, begin with:

- learning path
- vocabulary
- grammar
- food and drink
- travel and local area
- school
- daily routine
- weather
- speaking photo-card prompt
- empty state
