import { notFound } from "next/navigation";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  createGrammarPointAction,
  deleteGrammarPointAction,
} from "@/app/actions/admin/admin-grammar-point-actions";
import {
  getGrammarCoverageVariantCount,
  getGrammarCoverageVariantLabel,
  getGrammarCoverageVariantUsed,
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarPointCoverageByPointIdsDb,
  getGrammarTierLabel,
  getRequiredGrammarCoverageVariants,
  type DbGrammarKnowledgeRequirement,
  type DbGrammarPoint,
  type DbGrammarPointCoverage,
  type DbGrammarTier,
  loadGrammarSetByIdDb,
} from "@/lib/grammar/grammar-helpers-db";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";

type GrammarSetPointsPageProps = {
  params: Promise<{ grammarSetId: string }>;
  searchParams?: Promise<{
    pointSearch?: string;
    tier?: string;
    knowledgeRequirement?: string;
    categoryKey?: string;
    coverage?: string;
  }>;
};

type GrammarPointFilters = {
  pointSearch?: string;
  tier?: string;
  knowledgeRequirement?: string;
  categoryKey?: string;
  coverage?: string;
};

const TIER_FILTER_OPTIONS: DbGrammarTier[] = [
  "foundation",
  "higher",
  "both",
  "unknown",
];

const KNOWLEDGE_FILTER_OPTIONS: DbGrammarKnowledgeRequirement[] = [
  "productive",
  "receptive",
  "mixed",
  "unknown",
];

function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function getOrderedUniqueValues<T extends string>(values: T[], order: readonly T[]) {
  const uniqueValues = new Set(values);
  return order.filter((value) => uniqueValues.has(value));
}

function normalizeTierFilter(value?: string): DbGrammarTier | "all" {
  return value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

function normalizeKnowledgeRequirementFilter(
  value?: string
): DbGrammarKnowledgeRequirement | "all" {
  return value === "productive" ||
    value === "receptive" ||
    value === "mixed" ||
    value === "unknown"
    ? value
    : "all";
}

function normalizeCoverageFilter(value?: string) {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

function filterGrammarPoints({
  points,
  pointCoverageById,
  filters,
}: {
  points: DbGrammarPoint[];
  pointCoverageById: Map<string, DbGrammarPointCoverage>;
  filters: GrammarPointFilters;
}) {
  const search = filters.pointSearch?.trim().toLowerCase();
  const tier = normalizeTierFilter(filters.tier);
  const knowledgeRequirement = normalizeKnowledgeRequirementFilter(
    filters.knowledgeRequirement
  );
  const categoryKey = filters.categoryKey?.trim();
  const coverage = normalizeCoverageFilter(filters.coverage);

  return points.filter((point) => {
    if (search) {
      const haystack = [
        point.title,
        point.slug,
        point.short_description,
        point.full_explanation,
        point.spec_reference,
        point.grammar_tag_key,
        point.category_key,
        point.source_key,
        point.source_version,
        point.import_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier !== "all" && point.tier !== tier) {
      return false;
    }

    if (
      knowledgeRequirement !== "all" &&
      point.knowledge_requirement !== knowledgeRequirement
    ) {
      return false;
    }

    if (categoryKey && point.category_key !== categoryKey) {
      return false;
    }

    const pointCoverage = pointCoverageById.get(point.id);

    if (coverage === "foundation" && !pointCoverage?.used_in_foundation) {
      return false;
    }

    if (coverage === "higher" && !pointCoverage?.used_in_higher) {
      return false;
    }

    if (coverage === "volna" && !pointCoverage?.used_in_volna) {
      return false;
    }

    if (
      coverage === "unused" &&
      (pointCoverage?.used_in_foundation ||
        pointCoverage?.used_in_higher ||
        pointCoverage?.used_in_volna)
    ) {
      return false;
    }

    return true;
  });
}

function PointCoverageBadges({
  point,
  coverage,
}: {
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
}) {
  const variants = getRequiredGrammarCoverageVariants(point.tier);

  if (variants.length === 0) {
    return <Badge tone="warning">Unclassified coverage</Badge>;
  }

  return (
    <span className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Badge
          key={variant}
          tone={getGrammarCoverageVariantUsed(coverage, variant) ? "success" : "danger"}
          icon={getGrammarCoverageVariantUsed(coverage, variant) ? "success" : "cancel"}
        >
          {getGrammarCoverageVariantCount(coverage, variant) > 0
            ? `${getGrammarCoverageVariantLabel(variant)} ${getGrammarCoverageVariantCount(
                coverage,
                variant
              )}`
            : getGrammarCoverageVariantLabel(variant)}
        </Badge>
      ))}
    </span>
  );
}

function GrammarPointAdminCard({
  grammarSetId,
  point,
  coverage,
  position,
}: {
  grammarSetId: string;
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
  position: number;
}) {
  const knowledgeTone =
    point.knowledge_requirement === "receptive" ? "warning" : "muted";

  return (
    <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3 shadow-[var(--shadow-xs)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-sm font-semibold text-[var(--text-secondary)]">
            {position}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="break-words text-base font-semibold leading-6 text-[var(--text-primary)]">
                {point.title}
              </h3>
              <PublishStatusBadge isPublished={point.is_published} />
            </div>
            <p className="mt-1 max-w-3xl break-words text-sm leading-6 text-[var(--text-secondary)]">
              {point.short_description ?? "No short description yet."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 lg:justify-end">
          <Button
            href={`/admin/grammar/${grammarSetId}/points/${point.id}/edit`}
            variant="secondary"
            size="sm"
            icon="edit"
            className="min-h-8 rounded-lg px-2.5 py-1 text-xs"
          >
            Edit
          </Button>
          <form action={deleteGrammarPointAction}>
            <input type="hidden" name="grammarSetId" value={grammarSetId} />
            <input type="hidden" name="grammarPointId" value={point.id} />
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              size="sm"
              className="min-h-8 rounded-lg px-2.5 py-1 text-xs"
              confirmMessage={`Delete ${point.title}? This also deletes examples and tables.`}
            >
              Delete
            </AdminConfirmButton>
          </form>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
        <Badge tone="info">{getGrammarTierLabel(point.tier)}</Badge>
        <Badge tone="muted" className="capitalize">
          {getGrammarCategoryLabel(point.category_key)}
        </Badge>
        <Badge tone={knowledgeTone}>
          {getGrammarKnowledgeRequirementLabel(point.knowledge_requirement)}
        </Badge>
        <PointCoverageBadges point={point} coverage={coverage} />
      </div>
    </article>
  );
}

export default async function GrammarSetPointsPage({
  params,
  searchParams,
}: GrammarSetPointsPageProps) {
  const { grammarSetId } = await params;
  const pointFilters = (await searchParams) ?? {};
  const { grammarSet, points } = await loadGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    notFound();
  }

  const pointCoverageById = await getGrammarPointCoverageByPointIdsDb(
    points.map((point) => point.id)
  );
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
  const selectedCoverageFilter = normalizeCoverageFilter(pointFilters.coverage);
  const showTierFilter = tierOptions.length > 1 || selectedTierFilter !== "all";
  const showKnowledgeFilter =
    knowledgeRequirementOptions.length > 1 || selectedKnowledgeFilter !== "all";
  const showCategoryFilter =
    categoryOptions.length > 1 || Boolean(pointFilters.categoryKey?.trim());
  const hasActiveFilters =
    Boolean(pointFilters.pointSearch?.trim()) ||
    selectedTierFilter !== "all" ||
    selectedKnowledgeFilter !== "all" ||
    Boolean(pointFilters.categoryKey?.trim()) ||
    selectedCoverageFilter !== "all";

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Grammar points"
        title={grammarSet.title}
        description="Add, edit, publish, and order the grammar points inside this set."
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarSet.tier)}
            </Badge>
            <PublishStatusBadge
              isPublished={grammarSet.is_published}
              publishedLabel="Set published"
              draftLabel="Set draft"
            />
            <Badge tone="muted" icon="list">
              {points.length} point{points.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone={hasActiveFilters ? "info" : "muted"} icon="filter">
              {filteredPoints.length} shown
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/grammar" variant="secondary" icon="back">
              Back
            </Button>
            <Button
              href={`/admin/grammar/${grammarSet.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit set
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionCard
          title="Current points"
          description="Filter points by metadata and coverage, then open a point to edit its explanation, examples, and tables."
          tone="admin"
        >
          <form className="mb-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <div className="min-w-0 lg:min-w-[18rem] lg:flex-1">
              <Input
                name="pointSearch"
                defaultValue={pointFilters.pointSearch ?? ""}
                placeholder="Search title, rule, key..."
              />
            </div>

            {showTierFilter ? (
              <div className="min-w-0 lg:w-40">
                <Select name="tier" defaultValue={selectedTierFilter}>
                  <option value="all">All tiers</option>
                  {tierOptions.map((tier) => (
                    <option key={tier} value={tier}>
                      {getGrammarTierLabel(tier)}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {showKnowledgeFilter ? (
              <div className="min-w-0 lg:w-48">
                <Select
                  name="knowledgeRequirement"
                  defaultValue={selectedKnowledgeFilter}
                >
                  <option value="all">All requirements</option>
                  {knowledgeRequirementOptions.map((requirement) => (
                    <option key={requirement} value={requirement}>
                      {getGrammarKnowledgeRequirementLabel(requirement)}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {showCategoryFilter ? (
              <div className="min-w-0 lg:w-44">
                <Select name="categoryKey" defaultValue={pointFilters.categoryKey ?? ""}>
                  <option value="">All categories</option>
                  {categoryOptions.map((categoryKey) => (
                    <option key={categoryKey} value={categoryKey}>
                      {getGrammarCategoryLabel(categoryKey)}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            <div className="min-w-0 lg:w-44">
              <Select name="coverage" defaultValue={selectedCoverageFilter}>
                <option value="all">All coverage</option>
                <option value="foundation">Used in Foundation</option>
                <option value="higher">Used in Higher</option>
                <option value="volna">Used in Volna</option>
                <option value="unused">Unused</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 lg:ml-auto">
              <Button type="submit" variant="secondary" size="sm" icon="filter">
                Apply
              </Button>
              <Button
                href={`/admin/grammar/${grammarSet.id}/points`}
                variant="quiet"
                size="sm"
                icon="refresh"
              >
                Reset
              </Button>
            </div>
          </form>

          {points.length === 0 ? (
            <EmptyState
              icon="lessonContent"
              iconTone="brand"
              title="No grammar points yet"
              description="Use the form beside this list to add the first point."
            />
          ) : filteredPoints.length === 0 ? (
            <EmptyState
              icon="search"
              iconTone="brand"
              title="No grammar points match"
              description="Clear the current filters to inspect the full set again."
            />
          ) : (
            <div className="space-y-3">
              {filteredPoints.map((point, index) => (
                <GrammarPointAdminCard
                  key={point.id}
                  grammarSetId={grammarSet.id}
                  point={point}
                  coverage={pointCoverageById.get(point.id) ?? null}
                  position={index + 1}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <PanelCard
          title="Add grammar point"
          description="Create the core teaching point first; examples and tables are edited after creation."
          tone="admin"
        >
          <form action={createGrammarPointAction} className="space-y-4">
            <input type="hidden" name="grammarSetId" value={grammarSet.id} />

            <FormField label="Title" required>
              <Input name="title" required placeholder="Present tense endings" />
            </FormField>

            <FormField label="Slug" description="Leave blank to generate from the title.">
              <Input name="slug" placeholder="present-tense-endings" />
            </FormField>

            <FormField label="Short description">
              <Textarea
                name="shortDescription"
                rows={4}
                placeholder="How regular present tense verbs change for different subjects."
              />
            </FormField>

            <FormField label="Full explanation">
              <Textarea
                name="fullExplanation"
                rows={8}
                placeholder="Write the full student-facing explanation here."
              />
            </FormField>

            <FormField label="Spec reference">
              <Input
                name="specReference"
                placeholder="Foundation grammar appendix: verbs"
              />
            </FormField>

            <FormField label="Grammar tag">
              <Select name="grammarTagKey" defaultValue="">
                <option value="">No tag</option>
                {GRAMMAR_TAGS.map((tag) => (
                  <option key={tag.key} value={tag.key}>
                    {tag.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category key">
              <Input name="categoryKey" placeholder="verbs" />
            </FormField>

            <FormField
              label="Knowledge requirement"
              description="Use receptive for structures marked (R) in the specification."
            >
              <Select name="knowledgeRequirement" defaultValue="productive">
                <option value="productive">Productive knowledge</option>
                <option value="receptive">Receptive knowledge</option>
                <option value="mixed">Mixed knowledge</option>
                <option value="unknown">Unknown requirement</option>
              </Select>
            </FormField>

            <FormField label="Receptive scope">
              <Textarea
                name="receptiveScope"
                rows={3}
                placeholder="Only this substructure is receptive, if the point cannot be split further."
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tier">
                <Select name="tier" defaultValue={grammarSet.tier}>
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>

              <FormField label="Sort order">
                <Input name="sortOrder" type="number" min={0} step={1} />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Source key">
                <Input name="sourceKey" placeholder="edexcel_gcse_russian_spec" />
              </FormField>

              <FormField label="Source version">
                <Input name="sourceVersion" placeholder="Appendix 2" />
              </FormField>

              <FormField label="Import key">
                <Input name="importKey" placeholder="foundation:verbs:present-tense" />
              </FormField>
            </div>

            <CheckboxField
              name="isPublished"
              label="Published"
              description="Visible on the student grammar set page."
            />

            <Button type="submit" variant="primary" icon="create">
              Add grammar point
            </Button>
          </form>
        </PanelCard>
      </div>
    </main>
  );
}
