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
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
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

export default async function AdminGrammarPage({ searchParams }: AdminGrammarPageProps) {
  const params = (await searchParams) ?? {};
  const filters: GrammarSetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    themeKey: params.themeKey ?? null,
    published: normalizePublishedFilter(params.published),
  };
  const grammarSets = await getGrammarSetsDb(filters);
  const publishedCount = grammarSets.filter((set) => set.is_published).length;

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
          <form className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-full lg:max-w-xs">
              <Input
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search grammar..."
              />
            </div>

            <div className="w-full lg:max-w-[190px]">
              <Select name="tier" defaultValue={filters.tier ?? "all"}>
                <option value="all">All tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="both">Both tiers</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            <div className="w-full lg:max-w-[190px]">
              <Input
                name="themeKey"
                defaultValue={params.themeKey ?? ""}
                placeholder="Theme key"
              />
            </div>

            <div className="w-full lg:max-w-[180px]">
              <Select name="published" defaultValue={filters.published ?? "all"}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
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
