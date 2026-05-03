# Vocabulary Admin Production Notes

## Delete Safety

- Vocabulary sets should only be deletable when they have no items and no lesson usages.
- Vocabulary items should only be deletable when they are not used by Foundation, Higher, or Volna lesson coverage.
- Admin UI can still allow cleanup of empty unused draft sets and unused items.

## Legacy Metadata

The production admin UI should not create new records with these legacy set values:

- Tier: `unknown`
- List mode: `extended_only`, `spec_and_extended`
- Set type: `core`, `theme`, `phrase_bank`, `exam_prep`

Existing records with those values may be shown as legacy-only options while editing so old data is not accidentally overwritten. A later data cleanup can either migrate them to `lesson_custom` / `specification` or keep them as explicitly documented legacy categories.

For item-level source metadata, prefer:

- `custom` for lesson-sized/custom sets
- `spec_required` for specification vocabulary

Keep `extended` visible only for existing legacy items until a separate cleanup pass decides whether those rows should become custom extension content or spec-required content.
