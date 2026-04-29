import type {
  DbGrammarKnowledgeRequirement,
  DbGrammarTier,
} from "@/lib/grammar/types";

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
  if (!value) return "Uncategorised";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getGrammarThemeLabel(value: string | null) {
  if (!value) return "General";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getGrammarTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
