import type { DbGrammarKnowledgeRequirement, DbGrammarTier } from "@/lib/grammar/types";

const GRAMMAR_LABEL_OVERRIDES: Record<string, string> = {
  impersonal_constructions: "Impersonal constructions",
  numbers_and_quantity: "Numbers and quantity",
  pronouns_other: "Other pronouns",
  pronouns_personal: "Personal pronouns",
  quantifiers_intensifiers: "Quantifiers and intensifiers",
  starter_sentences: "Starter sentences",
  times_and_dates: "Times and dates",
};

function getReadableGrammarLabel(value: string | null, fallback: string) {
  if (!value) return fallback;

  const normalized = value.replaceAll("-", "_");
  const override = GRAMMAR_LABEL_OVERRIDES[normalized];

  if (override) return override;

  return normalized
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getGrammarTierLabel(tier: DbGrammarTier) {
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

export function getGrammarKnowledgeRequirementLabel(
  value: DbGrammarKnowledgeRequirement
) {
  switch (value) {
    case "productive":
      return "Productive knowledge";
    case "receptive":
      return "Receptive knowledge";
    case "mixed":
      return "Mixed knowledge";
    case "unknown":
      return "Unknown requirement";
    default:
      return value;
  }
}

export function getGrammarCategoryLabel(value: string | null) {
  return getReadableGrammarLabel(value, "Uncategorised");
}

export function getGrammarThemeLabel(value: string | null) {
  return getReadableGrammarLabel(value, "General");
}

export function getGrammarTopicLabel(value: string | null) {
  return getReadableGrammarLabel(value, "Mixed");
}
