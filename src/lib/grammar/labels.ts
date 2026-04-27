import type { DbGrammarTier } from "@/lib/grammar/types";

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

export function getGrammarCategoryLabel(value: string | null) {
  if (!value) return "Uncategorised";
  return value.replaceAll("_", " ");
}

export function getGrammarThemeLabel(value: string | null) {
  if (!value) return "General";
  return value.replaceAll("_", " ");
}

export function getGrammarTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return value.replaceAll("_", " ");
}
