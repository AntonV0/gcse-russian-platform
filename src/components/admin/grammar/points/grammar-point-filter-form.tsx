import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
  type DbGrammarKnowledgeRequirement,
  type DbGrammarTier,
} from "@/lib/grammar/grammar-helpers-db";
import {
  normalizeCoverageFilter,
  normalizeKnowledgeRequirementFilter,
  normalizeTierFilter,
} from "@/components/admin/grammar/points/point-filters";
import type { GrammarPointAdminFilters } from "@/components/admin/grammar/points/types";

export function GrammarPointFilterForm({
  grammarSetId,
  pointFilters,
  tierOptions,
  knowledgeRequirementOptions,
  categoryOptions,
  showTierFilter,
  showKnowledgeFilter,
  showCategoryFilter,
  showVolnaCoverageFilter,
}: {
  grammarSetId: string;
  pointFilters: GrammarPointAdminFilters;
  tierOptions: DbGrammarTier[];
  knowledgeRequirementOptions: DbGrammarKnowledgeRequirement[];
  categoryOptions: string[];
  showTierFilter: boolean;
  showKnowledgeFilter: boolean;
  showCategoryFilter: boolean;
  showVolnaCoverageFilter: boolean;
}) {
  return (
    <form className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-center">
        <Input
          name="pointSearch"
          defaultValue={pointFilters.pointSearch ?? ""}
          placeholder="Search title, rule, key..."
        />

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button type="submit" variant="secondary" size="sm" icon="filter">
            Apply
          </Button>
          <Button
            href={`/admin/grammar/${grammarSetId}/points`}
            variant="quiet"
            size="sm"
            icon="refresh"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {showTierFilter ? (
          <Select name="tier" defaultValue={normalizeTierFilter(pointFilters.tier)}>
            <option value="all">All tiers</option>
            {tierOptions.map((tier) => (
              <option key={tier} value={tier}>
                {getGrammarTierLabel(tier)}
              </option>
            ))}
          </Select>
        ) : null}

        {showKnowledgeFilter ? (
          <Select
            name="knowledgeRequirement"
            defaultValue={normalizeKnowledgeRequirementFilter(
              pointFilters.knowledgeRequirement
            )}
          >
            <option value="all">All requirements</option>
            {knowledgeRequirementOptions.map((requirement) => (
              <option key={requirement} value={requirement}>
                {getGrammarKnowledgeRequirementLabel(requirement)}
              </option>
            ))}
          </Select>
        ) : null}

        {showCategoryFilter ? (
          <Select name="categoryKey" defaultValue={pointFilters.categoryKey ?? ""}>
            <option value="">All categories</option>
            {categoryOptions.map((categoryKey) => (
              <option key={categoryKey} value={categoryKey}>
                {getGrammarCategoryLabel(categoryKey)}
              </option>
            ))}
          </Select>
        ) : null}

        <Select
          name="coverage"
          defaultValue={normalizeCoverageFilter(pointFilters.coverage)}
        >
          <option value="all">All coverage</option>
          <option value="foundation">Used in Foundation</option>
          <option value="higher">Used in Higher</option>
          {showVolnaCoverageFilter ? <option value="volna">Used in Volna</option> : null}
          <option value="unused">Unused</option>
        </Select>
      </div>
    </form>
  );
}
