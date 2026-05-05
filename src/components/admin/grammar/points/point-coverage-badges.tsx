import Badge from "@/components/ui/badge";
import {
  getGrammarCoverageVariantCount,
  getGrammarCoverageVariantLabel,
  getGrammarCoverageVariantUsed,
  getRequiredGrammarCoverageVariants,
  type DbGrammarPoint,
  type DbGrammarPointCoverage,
} from "@/lib/grammar/grammar-helpers-db";

export default function PointCoverageBadges({
  point,
  coverage,
}: {
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
}) {
  const variants = getRequiredGrammarCoverageVariants(point.tier).filter(
    (variant) =>
      variant !== "volna" || getGrammarCoverageVariantCount(coverage, variant) > 0
  );

  if (variants.length === 0) {
    return <Badge tone="warning">Unclassified coverage</Badge>;
  }

  return (
    <span className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const usageCount = getGrammarCoverageVariantCount(coverage, variant);
        const isUsed = getGrammarCoverageVariantUsed(coverage, variant);

        return (
          <Badge key={variant} tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
            {usageCount > 0
              ? `${getGrammarCoverageVariantLabel(variant)} ${usageCount}`
              : getGrammarCoverageVariantLabel(variant)}
          </Badge>
        );
      })}
    </span>
  );
}
