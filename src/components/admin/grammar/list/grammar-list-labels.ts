import {
  getGrammarTopicLabel,
  getGrammarTierLabel,
  type DbGrammarTier,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";

export function getGrammarUsageFilterLabel(
  value?: GrammarSetFilters["usageVariant"]
) {
  switch (value) {
    case "foundation":
      return "Foundation usage";
    case "higher":
      return "Higher usage";
    case "volna":
      return "Volna usage";
    case "unused":
      return "Unused sets";
    default:
      return "All usage";
  }
}

export function getShortGrammarTierLabel(
  tier: DbGrammarTier | "all"
) {
  if (tier === "both") return "Both";
  if (tier === "unknown") return "Unknown";
  if (tier === "all") return "All";
  return getGrammarTierLabel(tier);
}

export function getGrammarSourceFilterLabel(sourceKey: string) {
  if (sourceKey === "edexcel_gcse_russian_appendix_2") return "Appendix 2";
  if (sourceKey === "lesson_design_showcase") return "Showcase";
  if (sourceKey === "sample_introducing_yourself") return "Sample lesson";

  return sourceKey.replaceAll("_", " ");
}

export function getGrammarFilterLabel({
  key,
  value,
}: {
  key: "tier" | "topic" | "source" | "usage" | "published" | "search";
  value: string;
}) {
  if (key === "tier") {
    return getGrammarTierLabel(value as DbGrammarTier);
  }

  if (key === "topic") {
    return getGrammarTopicLabel(value);
  }

  if (key === "source") {
    return getGrammarSourceFilterLabel(value);
  }

  if (key === "usage") {
    return getGrammarUsageFilterLabel(value as GrammarSetFilters["usageVariant"]);
  }

  if (key === "published") {
    return value === "published" ? "Published" : "Draft";
  }

  return `Search: ${value}`;
}
