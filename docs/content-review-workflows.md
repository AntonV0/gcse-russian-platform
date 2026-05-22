# Content Review Workflows

Last reviewed: 2026-05-21

This document describes the current teacher review direction for GCSE Russian
content QA.

## Principle

AI can help draft lesson content, practice prompts, vocabulary support, and
assessment materials, but it is not the final authority. Teacher review remains
responsible for:

- linguistic naturalness
- exam suitability
- difficulty calibration
- cultural correctness
- authentic phrasing
- answer and prompt clarity

## Current Slice: Markdown Exports

The current review pipeline slice is admin-only Markdown export for reviewable
GCSE Russian content.

Admins can download a lesson-builder lesson as Markdown from the admin lesson
detail page. The export is designed for quick review in a document editor or
for pasting into a shared teacher QA document.

The V2 lesson export includes:

- course, variant, module, and lesson titles/slugs
- estimated minutes
- published, trial, paid-access, and Volna access metadata
- sections in saved order
- section title, kind, variant visibility, canonical key, and status
- blocks in saved order
- direct content for text-focused teaching blocks
- inline review content for linked GCSE Russian vocabulary sets where available
- inline review content for linked GCSE Russian grammar sets and points where
  available
- inline review content for linked question sets where available, including
  prompts, options, accepted answers, explanations, and media references
- references for image media, audio media, unknown block types, and missing or
  stale linked resources

Admins can also download vocabulary and grammar sets as Markdown from the
relevant admin set pages. These exports are intended for teacher QA of the
underlying lists and grammar explanations referenced by lessons.

The V1 vocabulary export includes:

- set title, slug, description, theme/topic, tier, list mode, and set type
- published, trial, paid-access, and Volna access metadata
- source/import metadata where present
- lists in saved order
- vocabulary items in stable order
- Russian, English, transliteration, examples, notes, and useful item metadata

The V1 grammar export includes:

- set title, slug, description, theme/topic, and tier
- published, trial, paid-access, and Volna access metadata
- source/import metadata where present
- grammar points in stable order
- point title, slug, description, explanation, spec reference, category/tag, and
  tier
- examples with Russian, English, highlights, and notes
- grammar tables rendered as Markdown tables where practical

## Explicit Non-Goals

The current slice does not add:

- review comments
- approvals
- content locking
- teacher assignment workflows
- version comparison
- mock exam or past paper export
- any change to student lesson rendering

## Linked Resource Handling

Lesson exports hydrate linked review resources only inside the admin export
route. Student lesson rendering continues to use the existing block renderers.

Linked vocabulary-set blocks include set/list metadata and vocabulary item rows.
Linked grammar-set blocks include set metadata, ordered points, explanations,
examples, and grammar tables. Linked question-set blocks include ordered
questions, options or accepted answers where available, explanations, and
references to any audio or image paths.

If a saved block points to a deleted or renamed resource, the export keeps the
original reference and adds a clear missing-resource note so the teacher can
flag the stale link during QA.

## Review Use

Teachers should use the Markdown exports as QA artifacts, then make accepted
changes back in the relevant admin editor. The platform remains the source of
truth for published GCSE Russian content.
