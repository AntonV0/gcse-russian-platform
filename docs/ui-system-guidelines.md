# UI System Guidelines

Status: current as of 2026-05-04.

This document defines visual and interaction standards for the GCSE Russian
Course Platform. Use it with the UI Lab and shared component code; the live
source of truth for implementation remains `src/components/` and `src/styles/`.

## Design Philosophy

The UI should feel:

- premium: clean, structured, and high-quality
- approachable: warm without becoming childish
- educational: clear, readable, and focused
- lightly engaging: subtle color, feedback, and interaction
- consistent: predictable patterns across public, student, teacher, and admin
  surfaces

This is not a playful gamified app, but it should not feel sterile.

## Visual Tone

Balance structure, polish, and approachability.

Prefer:

- calm hierarchy
- restrained color
- useful whitespace
- clear task focus
- reusable layout patterns

Avoid:

- excessive bright colors
- decorative gradients
- cluttered UI
- too many badges or pills
- heavy animations

## Typography

Typography must prioritize readability across English and Russian.

Use:

- clear hierarchy from page title to body and meta text
- comfortable line height
- readable body copy
- subtle labels and metadata

Avoid ultra-condensed, overly decorative, or harsh type treatments.

## Color

Color should be purposeful, consistent, and limited in scope.

Roles:

- primary brand color for actions and focus states
- success, warning, and error colors for feedback only
- neutral tones for layout, surfaces, and text

Use tint-based backgrounds before solid fills. Color should guide attention, not
decorate randomly.

## Spacing And Layout

Use consistent spacing and avoid random one-off values.

Preferred structure:

- page
- section
- repeated item card, table, panel, or form group
- content

Avoid deep nesting and card-inside-card layouts unless the inner card is a real
repeated item or modal-like surface.

## Surfaces

Surfaces should provide structure without visual heaviness.

Use:

- subtle borders
- soft elevation only where useful
- consistent radius
- clean internal spacing

Avoid excessive shadows and stacked decorative panels.

## Components

Do not build one-off UI when a shared component exists.

Prefer shared:

- buttons
- cards and panels
- badges
- inputs, selects, textareas, and controls
- tables
- navigation components
- empty states
- feedback messages

If a better pattern is created, promote it into the shared system instead of
forking variants page by page.

## Composition Patterns

Pages should be assembled from reusable patterns:

- page header
- section block
- card grid
- inspector panel
- toolbar and filters
- empty state
- locked content prompt
- admin table shell
- lesson builder layout

## Interaction And Feedback

Use subtle motion and visible state changes:

- hover
- focus
- pressed
- selected
- expanded/collapsed
- disabled
- loading

Avoid large animations, delayed interactions, and motion that competes with the
primary task.

## Icons

Use Lucide icons consistently. Keep sizes consistent and pair unfamiliar icons
with labels or tooltips. Icons should support meaning, not replace essential
text.

## Content Tone

Student-facing language should be clear, encouraging, and direct.

Avoid:

- jargon
- overly technical wording
- corporate tone

Admin copy can be denser, but it should still be scannable.

## Admin, Student, And Teacher Surfaces

Admin:

- denser
- functional
- clear hierarchy
- minimal decoration

Student:

- more visual
- more spacing
- more progress and state feedback
- warmer tone

Teacher:

- work-focused
- assignment and review oriented
- clear student/context cues

## UI Lab Role

The UI Lab is a reference environment, testing ground, and design-system preview.
It is not the source of truth for styling logic.

Real styling should live in:

- shared components
- shared patterns
- CSS variables and tokenized styles

## Definition Of Done

A UI element is complete when:

- it matches existing patterns
- it uses shared components where available
- spacing is consistent
- hover, focus, active, loading, empty, disabled, and error states are considered
- it works in real pages, not only in UI Lab
