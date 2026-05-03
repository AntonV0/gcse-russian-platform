import type {
  DbVocabularyDisplayVariant,
  DbVocabularyItem,
  DbVocabularyListMode,
  DbVocabularyProductiveReceptive,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";

const VOCABULARY_THEME_LABELS: Record<string, string> = {
  future_aspirations_study_work: "Future aspirations, study and work",
  future_aspirations_study_and_work: "Future aspirations, study and work",
  high_frequency_language: "High-frequency language",
  identity_and_culture: "Identity and culture",
  international_global_dimension: "International and global dimension",
  local_area_holiday_travel: "Local area, holiday and travel",
  local_area_holiday_and_travel: "Local area, holiday and travel",
  school: "School",
  theme_1_identity_culture: "Theme 1: Identity and culture",
  theme_2_local_area_holiday_travel: "Theme 2: Local area, holiday and travel",
  theme_3_school: "Theme 3: School",
  theme_4_future_work: "Theme 4: Future aspirations, study and work",
  theme_5_global_international: "Theme 5: International and global dimension",
};

const VOCABULARY_TOPIC_LABELS: Record<string, string> = {
  areas_mountains_seas_places: "Areas, mountains, seas and places",
  colours: "Colours",
  common_adjectives: "Common adjectives",
  common_adverbs: "Common adverbs",
  common_verbs: "Common verbs",
  connecting_words: "Some useful connecting words",
  continents: "Continents",
  countries: "Countries",
  days_of_the_week: "Days of the week",
  future_study_and_work: "Future aspirations, study and work",
  identity_and_culture_clothes_and_style: "Words relating to dress and style",
  identity_and_culture_cultural_life: "Cultural life",
  identity_and_culture_family_and_relationships:
    "Relations, relationships, personal and physical characteristics",
  identity_and_culture_food_and_drink: "Daily life, food and drink",
  identity_and_culture_using_social_media: "Using social media",
  international_global_dimension_bringing_world_together_environmental_issues:
    "Bringing the world together and environmental issues",
  language_used_in_dialogues_and_messages: "Language used in dialogues and messages",
  local_area_holiday_travel: "Local area, holiday and travel",
  local_area_holiday_travel_directions: "Asking for directions",
  local_area_holiday_travel_problems: "Dealing with problems",
  local_area_holiday_travel_weather: "Phrases associated with weather",
  months_and_seasons: "Months and seasons of the year",
  nationalities: "Nationalities",
  numbers: "Numbers",
  ordinal_numbers: "Ordinal numbers",
  other_high_frequency_words: "Other high-frequency words",
  prepositions: "Prepositions",
  quantities_and_measures: "Quantities and measures",
  question_words: "Question words",
  school_life: "School",
  social_conventions: "Social conventions",
  time_expressions: "Time expressions",
  times_of_day: "Times of day",
  useful_abbreviations_and_acronyms: "Useful abbreviations and acronyms",
  useful_expressions: "Useful expressions",
};

const VOCABULARY_SOURCE_LABELS: Record<string, string> = {
  "gcse-russian-course-map": "GCSE Russian course map",
  "lesson-design-showcase": "Lesson design showcase",
  lesson_design_showcase: "Lesson design showcase",
  pearson_edexcel_gcse_russian_1ru0: "Pearson Edexcel GCSE Russian 1RU0",
};

function getVocabularyKeyFallbackLabel(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

export function groupVocabularyItemsBySource(items: DbVocabularyItem[]) {
  return {
    specRequired: items.filter((item) => item.source_type === "spec_required"),
    extended: items.filter((item) => item.source_type === "extended"),
    custom: items.filter((item) => item.source_type === "custom"),
  };
}

export function getVocabularyListModeLabel(listMode: DbVocabularyListMode) {
  switch (listMode) {
    case "spec_only":
      return "Exam list";
    case "extended_only":
      return "Extra practice";
    case "spec_and_extended":
      return "Exam + extra";
    case "custom":
      return "Custom set";
    default:
      return listMode;
  }
}

export function getVocabularyTierLabel(tier: DbVocabularyTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    case "unknown":
      return "Unknown tier";
    default:
      return tier;
  }
}

export function getVocabularyProductiveReceptiveLabel(
  value: DbVocabularyProductiveReceptive
) {
  switch (value) {
    case "productive":
      return "Productive";
    case "receptive":
      return "Receptive";
    case "both":
      return "Productive + receptive";
    case "unknown":
      return "Unknown";
    default:
      return value;
  }
}

export function getVocabularySetTypeLabel(setType: DbVocabularySetType) {
  switch (setType) {
    case "specification":
      return "Specification";
    case "core":
      return "Core";
    case "theme":
      return "Theme";
    case "phrase_bank":
      return "Phrase bank";
    case "exam_prep":
      return "Exam prep";
    case "lesson_custom":
      return "Lesson custom";
    default:
      return setType;
  }
}

export function getVocabularyDisplayVariantLabel(
  displayVariant: DbVocabularyDisplayVariant
) {
  switch (displayVariant) {
    case "single_column":
      return "Single column";
    case "two_column":
      return "Two column";
    case "compact_cards":
      return "Compact cards";
    default:
      return displayVariant;
  }
}

export function getVocabularyThemeLabel(value: string | null) {
  if (!value) return "General";
  return VOCABULARY_THEME_LABELS[value] ?? getVocabularyKeyFallbackLabel(value);
}

export function getVocabularyTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return VOCABULARY_TOPIC_LABELS[value] ?? getVocabularyKeyFallbackLabel(value);
}

export function getVocabularyCategoryLabel(value: string | null) {
  if (!value) return "Uncategorised";
  return VOCABULARY_TOPIC_LABELS[value] ?? getVocabularyKeyFallbackLabel(value);
}

export function getVocabularySourceLabel(value: string | null) {
  if (!value) return "No source";
  return VOCABULARY_SOURCE_LABELS[value] ?? getVocabularyKeyFallbackLabel(value);
}
