import Badge from "@/components/ui/badge";
import {
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
  type DbVocabularyItem,
  type DbVocabularyItemCoverage,
} from "@/lib/vocabulary/vocabulary-helpers-db";

function CoverageBadge({
  label,
  isUsed,
  count,
}: {
  label: string;
  isUsed: boolean;
  count?: number;
}) {
  return (
    <Badge tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
      {count && count > 0 ? `${label} ${count}` : label}
    </Badge>
  );
}

export default function VocabularyItemCoverageBadges({
  item,
  coverage,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
}) {
  const lessonCoverageVariants = getRequiredVocabularyCoverageVariants(item.tier);

  return (
    <div className="flex flex-wrap gap-2">
      {lessonCoverageVariants.map((variant) => (
        <CoverageBadge
          key={variant}
          label={getVocabularyCoverageVariantLabel(variant)}
          isUsed={getVocabularyCoverageVariantUsed(coverage, variant)}
          count={getVocabularyCoverageVariantCount(coverage, variant)}
        />
      ))}

      <CoverageBadge
        label="Custom list"
        isUsed={Boolean(coverage?.used_in_custom_list)}
        count={coverage?.custom_list_occurrences ?? 0}
      />
    </div>
  );
}
