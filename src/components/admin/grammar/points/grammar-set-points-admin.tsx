import { CurrentGrammarPointsSection } from "@/components/admin/grammar/points/current-grammar-points-section";
import { GrammarPointEntryFormSection } from "@/components/admin/grammar/points/grammar-point-entry-form-section";
import { GrammarSetPointsStatsSection } from "@/components/admin/grammar/points/grammar-set-points-stats-section";
import { GrammarSetPointsSummarySection } from "@/components/admin/grammar/points/grammar-set-points-summary-section";
import OperationsWorkspace, {
  OperationsSection,
} from "@/components/ui/operations-workspace";
import {
  filterGrammarPoints,
  getOrderedUniqueValues,
  getUniqueSortedValues,
  hasActiveGrammarPointFilters,
  KNOWLEDGE_FILTER_OPTIONS,
  normalizeKnowledgeRequirementFilter,
  normalizeTierFilter,
  TIER_FILTER_OPTIONS,
} from "@/components/admin/grammar/points/point-filters";
import type {
  GrammarPointAdminStats,
  GrammarSetPointsAdminProps,
} from "@/components/admin/grammar/points/types";

function getGrammarPointStats({
  points,
  pointCoverageById,
  pointContentHealthById,
}: Pick<
  GrammarSetPointsAdminProps,
  "points" | "pointCoverageById" | "pointContentHealthById"
>): GrammarPointAdminStats {
  const totalPoints = points.length;
  const publishedPoints = points.filter((point) => point.is_published).length;
  const draftPoints = totalPoints - publishedPoints;
  const foundationUsages = Array.from(pointCoverageById.values()).reduce(
    (sum, coverage) => sum + coverage.foundation_occurrences,
    0
  );
  const higherUsages = Array.from(pointCoverageById.values()).reduce(
    (sum, coverage) => sum + coverage.higher_occurrences,
    0
  );
  const publishedHealth = points
    .filter((point) => point.is_published)
    .map((point) => pointContentHealthById.get(point.id))
    .filter(Boolean);
  const missingExplanationPoints = publishedHealth.filter(
    (health) => health?.missing_explanation
  ).length;
  const missingExamplePoints = publishedHealth.filter(
    (health) => health?.missing_examples
  ).length;

  return {
    totalPoints,
    publishedPoints,
    draftPoints,
    foundationUsages,
    higherUsages,
    missingExplanationPoints,
    missingExamplePoints,
  };
}

export default function GrammarSetPointsAdmin({
  grammarSet,
  points,
  pointCoverageById,
  pointContentHealthById,
  pointFilters,
}: GrammarSetPointsAdminProps) {
  const filteredPoints = filterGrammarPoints({
    points,
    pointCoverageById,
    filters: pointFilters,
  });
  const categoryOptions = getUniqueSortedValues(
    points.map((point) => point.category_key)
  );
  const tierOptions = getOrderedUniqueValues(
    points.map((point) => point.tier),
    TIER_FILTER_OPTIONS
  );
  const knowledgeRequirementOptions = getOrderedUniqueValues(
    points.map((point) => point.knowledge_requirement),
    KNOWLEDGE_FILTER_OPTIONS
  );
  const selectedTierFilter = normalizeTierFilter(pointFilters.tier);
  const selectedKnowledgeFilter = normalizeKnowledgeRequirementFilter(
    pointFilters.knowledgeRequirement
  );
  const hasActivePointFilters = hasActiveGrammarPointFilters(pointFilters);
  const showTierFilter = tierOptions.length > 1 || selectedTierFilter !== "all";
  const showKnowledgeFilter =
    knowledgeRequirementOptions.length > 1 || selectedKnowledgeFilter !== "all";
  const showCategoryFilter =
    categoryOptions.length > 1 || Boolean(pointFilters.categoryKey?.trim());
  const showVolnaCoverageFilter = Array.from(pointCoverageById.values()).some(
    (coverage) => coverage.used_in_volna
  );
  const stats = getGrammarPointStats({
    points,
    pointCoverageById,
    pointContentHealthById,
  });

  return (
    <main>
      <OperationsWorkspace>
        <GrammarSetPointsSummarySection grammarSet={grammarSet} />

        <OperationsSection>
          <div className="space-y-4">
            <GrammarSetPointsStatsSection stats={stats} />

            <CurrentGrammarPointsSection
              grammarSetId={grammarSet.id}
              points={points}
              filteredPoints={filteredPoints}
              pointCoverageById={pointCoverageById}
              pointContentHealthById={pointContentHealthById}
              pointFilters={pointFilters}
              tierOptions={tierOptions}
              knowledgeRequirementOptions={knowledgeRequirementOptions}
              categoryOptions={categoryOptions}
              hasActivePointFilters={hasActivePointFilters}
              showTierFilter={showTierFilter}
              showKnowledgeFilter={showKnowledgeFilter}
              showCategoryFilter={showCategoryFilter}
              showVolnaCoverageFilter={showVolnaCoverageFilter}
            />

            <GrammarPointEntryFormSection
              grammarSet={grammarSet}
              defaultOpen={points.length === 0}
            />
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
