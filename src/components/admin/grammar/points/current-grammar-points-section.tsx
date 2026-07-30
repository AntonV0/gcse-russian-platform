import Badge from "@/components/ui/badge";
import GrammarPointAdminCard from "@/components/admin/grammar/points/grammar-point-admin-card";
import { GrammarPointFilterForm } from "@/components/admin/grammar/points/grammar-point-filter-form";
import { GrammarPointsEmptyState } from "@/components/admin/grammar/points/primitives";
import type {
  DbGrammarKnowledgeRequirement,
  DbGrammarPoint,
  DbGrammarPointContentHealth,
  DbGrammarPointCoverage,
  DbGrammarTier,
} from "@/lib/grammar/grammar-helpers-db";
import type { GrammarPointAdminFilters } from "@/components/admin/grammar/points/types";

export function CurrentGrammarPointsSection({
  grammarSetId,
  points,
  filteredPoints,
  pointCoverageById,
  pointContentHealthById,
  pointFilters,
  tierOptions,
  knowledgeRequirementOptions,
  categoryOptions,
  hasActivePointFilters,
  showTierFilter,
  showKnowledgeFilter,
  showCategoryFilter,
  showVolnaCoverageFilter,
}: {
  grammarSetId: string;
  points: DbGrammarPoint[];
  filteredPoints: DbGrammarPoint[];
  pointCoverageById: Map<string, DbGrammarPointCoverage>;
  pointContentHealthById: Map<string, DbGrammarPointContentHealth>;
  pointFilters: GrammarPointAdminFilters;
  tierOptions: DbGrammarTier[];
  knowledgeRequirementOptions: DbGrammarKnowledgeRequirement[];
  categoryOptions: string[];
  hasActivePointFilters: boolean;
  showTierFilter: boolean;
  showKnowledgeFilter: boolean;
  showCategoryFilter: boolean;
  showVolnaCoverageFilter: boolean;
}) {
  return (
    <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <h2 className="app-heading-subsection">Current points</h2>
          <p className="mt-2 app-text-body-muted">
            Filter points by metadata and coverage, then open a point to edit its
            explanation, examples, and tables.
          </p>
        </div>

        <GrammarPointFilterForm
          grammarSetId={grammarSetId}
          pointFilters={pointFilters}
          tierOptions={tierOptions}
          knowledgeRequirementOptions={knowledgeRequirementOptions}
          categoryOptions={categoryOptions}
          showTierFilter={showTierFilter}
          showKnowledgeFilter={showKnowledgeFilter}
          showCategoryFilter={showCategoryFilter}
          showVolnaCoverageFilter={showVolnaCoverageFilter}
        />

        <div className="flex flex-wrap gap-2">
          <Badge tone={hasActivePointFilters ? "info" : "muted"} icon="filter">
            {filteredPoints.length} of {points.length} shown
          </Badge>
          {hasActivePointFilters ? (
            <Badge tone="muted" icon="grammar">
              Metadata filters active
            </Badge>
          ) : null}
        </div>
      </div>

      {points.length === 0 ? (
        <GrammarPointsEmptyState>
          No grammar points in this set yet. Open the add panel below to create the first
          teaching point.
        </GrammarPointsEmptyState>
      ) : filteredPoints.length === 0 ? (
        <GrammarPointsEmptyState>
          No grammar points match the current metadata filters. Clear the filters to
          inspect the full set again.
        </GrammarPointsEmptyState>
      ) : (
        <div className="space-y-4">
          {filteredPoints.map((point, index) => (
            <GrammarPointAdminCard
              key={point.id}
              grammarSetId={grammarSetId}
              point={point}
              coverage={pointCoverageById.get(point.id) ?? null}
              health={pointContentHealthById.get(point.id) ?? null}
              position={index + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
