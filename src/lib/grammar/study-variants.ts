import type {
  DbGrammarCoverageVariant,
  DbGrammarPoint,
  DbGrammarPointCoverage,
  DbGrammarSetUsageStats,
  DbGrammarStudyVariant,
  DbGrammarTier,
  DbGrammarUsageVariant,
} from "@/lib/grammar/types";

export function getRequiredGrammarCoverageVariants(tier: DbGrammarTier) {
  if (tier === "foundation") {
    return ["foundation", "higher", "volna"] as const;
  }

  if (tier === "higher") {
    return ["higher", "volna"] as const;
  }

  if (tier === "both") {
    return ["foundation", "higher", "volna"] as const;
  }

  return [] as const;
}

export function getGrammarPointAppliesToStudyVariant(
  pointTier: DbGrammarTier,
  studyVariant: DbGrammarStudyVariant
) {
  if (pointTier === "both") {
    return true;
  }

  if (pointTier === "unknown") {
    return false;
  }

  if (studyVariant === "foundation") {
    return pointTier === "foundation";
  }

  return pointTier === "foundation" || pointTier === "higher";
}

export function filterGrammarPointsForStudyVariant(
  points: DbGrammarPoint[],
  studyVariant?: DbGrammarStudyVariant | "all" | null
) {
  if (!studyVariant || studyVariant === "all") {
    return points;
  }

  return points.filter((point) =>
    getGrammarPointAppliesToStudyVariant(point.tier, studyVariant)
  );
}

export function getGrammarCoverageVariantLabel(variant: DbGrammarCoverageVariant) {
  switch (variant) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "volna":
      return "Volna";
    default:
      return variant;
  }
}

export function getGrammarCoverageVariantCount(
  coverage: DbGrammarPointCoverage | null,
  variant: DbGrammarCoverageVariant
) {
  if (!coverage) return 0;

  switch (variant) {
    case "foundation":
      return coverage.foundation_occurrences;
    case "higher":
      return coverage.higher_occurrences;
    case "volna":
      return coverage.volna_occurrences;
    default:
      return 0;
  }
}

export function getGrammarCoverageVariantUsed(
  coverage: DbGrammarPointCoverage | null,
  variant: DbGrammarCoverageVariant
) {
  return getGrammarCoverageVariantCount(coverage, variant) > 0;
}

export function buildGrammarUsageStats(
  usages: Pick<{ variant: DbGrammarUsageVariant }, "variant">[]
): DbGrammarSetUsageStats {
  let foundationOccurrences = 0;
  let higherOccurrences = 0;
  let volnaOccurrences = 0;

  for (const usage of usages) {
    switch (usage.variant) {
      case "foundation":
        foundationOccurrences += 1;
        break;
      case "higher":
        higherOccurrences += 1;
        break;
      case "volna":
        volnaOccurrences += 1;
        break;
      default:
        break;
    }
  }

  const totalOccurrences = foundationOccurrences + higherOccurrences + volnaOccurrences;

  return {
    totalOccurrences,
    foundationOccurrences,
    higherOccurrences,
    volnaOccurrences,
    usedInFoundation: foundationOccurrences > 0,
    usedInHigher: higherOccurrences > 0,
    usedInVolna: volnaOccurrences > 0,
  };
}
