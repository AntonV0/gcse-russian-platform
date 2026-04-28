import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import GrammarCoverageBadges from "@/components/grammar/grammar-coverage-badges";
import { deleteGrammarSetAction } from "@/app/actions/admin/admin-grammar-actions";
import {
  getGrammarSetsDb,
  getGrammarThemeLabel,
  getGrammarTierLabel,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";

type AdminGrammarPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    themeKey?: string;
    sourceKey?: string;
    usageVariant?: string;
    published?: string;
  }>;
};

function normalizePublishedFilter(value?: string): GrammarSetFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

function normalizeTierFilter(value?: string): GrammarSetFilters["tier"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  return "all";
}

function normalizeUsageVariantFilter(
  value?: string
): GrammarSetFilters["usageVariant"] {
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

function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function getUsageFilterLabel(value?: GrammarSetFilters["usageVariant"]) {
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

const GRAMMAR_ADMIN_SAVED_FILTERS = [
  {
    label: "Spec grammar",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&published=published",
    description: "Published Appendix 2 grammar sets.",
  },
  {
    label: "Unused grammar",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=unused",
    description: "Specification grammar not attached to lessons yet.",
  },
  {
    label: "Foundation coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=foundation",
    description: "Grammar used in Foundation lessons.",
  },
  {
    label: "Higher coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=higher",
    description: "Grammar used in Higher lessons.",
  },
  {
    label: "Volna coverage",
    href: "/admin/grammar?sourceKey=edexcel_gcse_russian_appendix_2&usageVariant=volna",
    description: "Grammar used in Volna lessons.",
  },
] as const;

export default async function AdminGrammarPage({ searchParams }: AdminGrammarPageProps) {
  const params = (await searchParams) ?? {};
  const filters: GrammarSetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    themeKey: params.themeKey ?? null,
    sourceKey: params.sourceKey ?? null,
    usageVariant: normalizeUsageVariantFilter(params.usageVariant),
    published: normalizePublishedFilter(params.published),
  };
  const [grammarSets, allGrammarSets] = await Promise.all([
    getGrammarSetsDb(filters),
    getGrammarSetsDb(),
  ]);
  const publishedCount = grammarSets.filter((set) => set.is_published).length;
  const draftCount = grammarSets.length - publishedCount;
  const totalPoints = grammarSets.reduce((sum, set) => sum + set.point_count, 0);
  const totalUsages = grammarSets.reduce(
    (sum, set) => sum + set.usage_stats.totalOccurrences,
    0
  );
  const themeKeys = getUniqueSortedValues(allGrammarSets.map((set) => set.theme_key));
  const sourceKeys = getUniqueSortedValues(allGrammarSets.map((set) => set.source_key));
  const missingSourceSets = allGrammarSets.filter((set) => !set.source_key).length;
  const missingTopicSets = allGrammarSets.filter((set) => !set.topic_key).length;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin grammar"
        title="Grammar Management"
        description="Create structured grammar sets, points, examples, and flexible JSON-backed grammar tables."
        badges={
          <>
            <Badge tone="info" icon="grammar">
              Grammar CMS
            </Badge>
            <Badge tone="muted" icon="list">
              {grammarSets.length} set{grammarSets.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="published">
              {publishedCount} published
            </Badge>
          </>
        }
        actions={
          <Button href="/admin/grammar/create" variant="primary" icon="create">
            Create grammar set
          </Button>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SummaryStatCard
          title="Grammar sets"
          value={grammarSets.length}
          description="Reusable sets matching the current filters."
          icon="grammar"
        />
        <SummaryStatCard
          title="Published"
          value={publishedCount}
          description="Visible on the student grammar page."
          icon="published"
        />
        <SummaryStatCard
          title="Draft"
          value={draftCount}
          description="Hidden from students until published."
          icon="draft"
        />
        <SummaryStatCard
          title="Points"
          value={totalPoints}
          description="Atomic grammar points in filtered sets."
          icon="list"
        />
        <SummaryStatCard
          title="Lesson usage"
          value={totalUsages}
          description={`${getUsageFilterLabel(filters.usageVariant)} across filtered sets.`}
          icon="lessons"
        />
      </section>

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="app-heading-subsection">Saved grammar views</h2>
            <p className="mt-2 app-text-body-muted">
              Jump to the planning slices used when checking Appendix 2 coverage.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {GRAMMAR_ADMIN_SAVED_FILTERS.map((filter) => (
              <Button
                key={filter.href}
                href={filter.href}
                variant="secondary"
                size="sm"
                icon="filter"
                title={filter.description}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <SummaryStatCard
          title="Missing source"
          value={missingSourceSets}
          description="Sets without import/source metadata."
          icon="file"
          tone={missingSourceSets === 0 ? "success" : "warning"}
          compact
        />
        <SummaryStatCard
          title="Missing topic"
          value={missingTopicSets}
          description="Sets that cannot be grouped cleanly yet."
          icon="folder"
          tone={missingTopicSets === 0 ? "success" : "warning"}
          compact
        />
      </section>

      <TableShell
        title="Grammar sets"
        description="Search, filter, publish, and open grammar sets for point-level editing."
        actions={
          <Button href="/grammar" variant="secondary" icon="preview">
            Student view
          </Button>
        }
      >
        <TableToolbar>
          <form className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(6,minmax(140px,1fr))_max-content] xl:items-center">
            <div className="min-w-0">
              <Input
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search grammar..."
              />
            </div>

            <div className="min-w-0">
              <Select name="tier" defaultValue={filters.tier ?? "all"}>
                <option value="all">All tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="both">Both tiers</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
                <option value="">All themes</option>
                {themeKeys.map((themeKey) => (
                  <option key={themeKey} value={themeKey}>
                    {getGrammarThemeLabel(themeKey)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="sourceKey" defaultValue={filters.sourceKey ?? ""}>
                <option value="">All sources</option>
                {sourceKeys.map((sourceKey) => (
                  <option key={sourceKey} value={sourceKey}>
                    {sourceKey.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-0">
              <Select
                name="usageVariant"
                defaultValue={filters.usageVariant ?? "all"}
              >
                <option value="all">All usage</option>
                <option value="foundation">Used in Foundation</option>
                <option value="higher">Used in Higher</option>
                <option value="volna">Used in Volna</option>
                <option value="unused">Unused</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="published" defaultValue={filters.published ?? "all"}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
              <Button type="submit" variant="secondary" size="sm" icon="filter">
                Apply
              </Button>
              <Button href="/admin/grammar" variant="quiet" size="sm" icon="refresh">
                Reset
              </Button>
            </div>
          </form>
        </TableToolbar>

        {grammarSets.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon="grammar"
              iconTone="brand"
              title="No grammar sets found"
              description="Create the first grammar set, or clear the current filters."
              action={
                <Button href="/admin/grammar/create" variant="primary" icon="create">
                  Create grammar set
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderRow>
                <DataTableHeaderCell>Set</DataTableHeaderCell>
                <DataTableHeaderCell>Tier</DataTableHeaderCell>
                <DataTableHeaderCell>Theme</DataTableHeaderCell>
                <DataTableHeaderCell>Points</DataTableHeaderCell>
                <DataTableHeaderCell>Usage</DataTableHeaderCell>
                <DataTableHeaderCell>Coverage</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Access</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableHeaderRow>
            </DataTableHead>

            <DataTableBody>
              {grammarSets.map((grammarSet) => (
                <DataTableRow key={grammarSet.id}>
                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        {grammarSet.title}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {grammarSet.slug}
                      </div>
                      {grammarSet.description ? (
                        <div className="max-w-md text-sm text-[var(--text-secondary)]">
                          {grammarSet.description}
                        </div>
                      ) : null}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge tone="info" icon="school">
                      {getGrammarTierLabel(grammarSet.tier)}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell className="capitalize">
                    {getGrammarThemeLabel(grammarSet.theme_key)}
                  </DataTableCell>

                  <DataTableCell>{grammarSet.point_count}</DataTableCell>

                  <DataTableCell>
                    <div className="grid min-w-[8rem] grid-cols-3 gap-1 text-center">
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">F</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {grammarSet.usage_stats.foundationOccurrences}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">H</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {grammarSet.usage_stats.higherOccurrences}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">V</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {grammarSet.usage_stats.volnaOccurrences}
                        </div>
                      </div>
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="flex min-w-[12rem] flex-wrap gap-2">
                      <GrammarCoverageBadges
                        coverageSummary={grammarSet.coverage_summary}
                        fallbackTotalPoints={grammarSet.point_count}
                      />
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <PublishStatusBadge isPublished={grammarSet.is_published} />
                  </DataTableCell>

                  <DataTableCell>
                    <div className="flex flex-wrap gap-2">
                      {grammarSet.is_trial_visible ? (
                        <Badge tone="success">Trial</Badge>
                      ) : null}
                      {grammarSet.available_in_volna ? (
                        <Badge tone="muted">Volna</Badge>
                      ) : null}
                      {grammarSet.requires_paid_access ? (
                        <Badge tone="muted">Paid</Badge>
                      ) : (
                        <Badge tone="info">Open</Badge>
                      )}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={`/admin/grammar/${grammarSet.id}/points`}
                        variant="secondary"
                        size="sm"
                        icon="list"
                      >
                        Points
                      </Button>
                      <Button
                        href={`/admin/grammar/${grammarSet.id}/edit`}
                        variant="quiet"
                        size="sm"
                        icon="edit"
                      >
                        Edit
                      </Button>
                      <form action={deleteGrammarSetAction}>
                        <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                        <AdminConfirmButton
                          variant="danger"
                          icon="delete"
                          confirmMessage={`Delete ${grammarSet.title}? This also deletes its points, examples, and tables.`}
                        >
                          Delete
                        </AdminConfirmButton>
                      </form>
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </TableShell>
    </main>
  );
}
