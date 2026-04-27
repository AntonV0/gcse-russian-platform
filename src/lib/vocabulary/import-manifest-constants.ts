export const REVIEW_STATUSES = ["draft", "reviewed", "approved"] as const;
export const TIERS = ["foundation", "higher", "both", "unknown"] as const;
export const LIST_MODES = [
  "spec_only",
  "extended_only",
  "spec_and_extended",
  "custom",
] as const;
export const SET_TYPES = [
  "specification",
  "core",
  "theme",
  "phrase_bank",
  "exam_prep",
  "lesson_custom",
] as const;
export const DISPLAY_VARIANTS = ["single_column", "two_column", "compact_cards"] as const;
export const ITEM_TYPES = ["word", "phrase"] as const;
export const SOURCE_TYPES = ["spec_required", "extended", "custom"] as const;
export const PRIORITIES = ["core", "extension"] as const;
export const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "number",
  "phrase",
  "interjection",
  "other",
  "unknown",
] as const;
export const GENDERS = [
  "masculine",
  "feminine",
  "neuter",
  "plural_only",
  "common",
  "not_applicable",
  "unknown",
] as const;
export const PRODUCTIVE_RECEPTIVE = [
  "productive",
  "receptive",
  "both",
  "unknown",
] as const;
export const ASPECTS = [
  "perfective",
  "imperfective",
  "both",
  "not_applicable",
  "unknown",
] as const;
