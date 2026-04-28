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
import { deleteVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/labels";
import { getVocabularySetsDb } from "@/lib/vocabulary/set-list-queries";
import type { VocabularySetFilters } from "@/lib/vocabulary/types";

type AdminVocabularyPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    listMode?: string;
    themeKey?: string;
    published?: string;
  }>;
};

function normalizeTierFilter(value?: string): VocabularySetFilters["tier"] {
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

function normalizeListModeFilter(value?: string): VocabularySetFilters["listMode"] {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function normalizePublishedFilter(value?: string): VocabularySetFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

export default async function AdminVocabularyPage({
  searchParams,
}: AdminVocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    themeKey: params.themeKey ?? null,
    published: normalizePublishedFilter(params.published),
  };
  const vocabularySets = await getVocabularySetsDb({ filters });
  const totalSets = vocabularySets.length;
  const publishedSets = vocabularySets.filter((set) => set.is_published).length;
  const draftSets = totalSets - publishedSets;
  const totalItems = vocabularySets.reduce((sum, set) => sum + set.item_count, 0);

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin vocabulary"
        title="Vocabulary Management"
        description="Create, edit, publish, filter, and inspect reusable vocabulary sets for lessons and revision."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary CMS
            </Badge>
            <Badge tone="muted" icon="list">
              {totalSets} set{totalSets === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="published">
              {publishedSets} published
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/vocabulary" variant="secondary" icon="preview">
              Student view
            </Button>
            <Button href="/admin/vocabulary/create" variant="primary" icon="create">
              Create vocabulary set
            </Button>
          </>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Vocabulary sets"
          value={totalSets}
          description="Reusable sets matching the current filters."
          icon="vocabulary"
        />
        <SummaryStatCard
          title="Published"
          value={publishedSets}
          description="Visible on the student vocabulary page."
          icon="published"
        />
        <SummaryStatCard
          title="Draft"
          value={draftSets}
          description="Hidden from students until published."
          icon="draft"
        />
        <SummaryStatCard
          title="Items"
          value={totalItems}
          description="Total vocabulary items inside filtered sets."
          icon="list"
        />
      </section>

      <TableShell
        title="Vocabulary sets"
        description="Use filters to find sets, publish drafts, manage items, or preview the student-facing page."
        actions={
          <Button
            href="/admin/vocabulary/create"
            variant="primary"
            size="sm"
            icon="create"
          >
            New set
          </Button>
        }
      >
        <TableToolbar>
          <form className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
            <div className="w-full xl:max-w-xs">
              <Input
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search vocabulary..."
              />
            </div>

            <div className="w-full xl:max-w-[180px]">
              <Select name="tier" defaultValue={filters.tier ?? "all"}>
                <option value="all">All tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="both">Both tiers</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            <div className="w-full xl:max-w-[210px]">
              <Select name="listMode" defaultValue={filters.listMode ?? "all"}>
                <option value="all">All modes</option>
                <option value="custom">Custom</option>
                <option value="spec_only">Spec only</option>
                <option value="extended_only">Extended only</option>
                <option value="spec_and_extended">Spec + extended</option>
              </Select>
            </div>

            <div className="w-full xl:max-w-[180px]">
              <Input
                name="themeKey"
                defaultValue={params.themeKey ?? ""}
                placeholder="Theme key"
              />
            </div>

            <div className="w-full xl:max-w-[170px]">
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
              <Button href="/admin/vocabulary" variant="quiet" size="sm" icon="refresh">
                Reset
              </Button>
            </div>
          </form>
        </TableToolbar>

        {vocabularySets.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon="vocabulary"
              iconTone="brand"
              title="No vocabulary sets found"
              description="Create a set, or clear the current filters to see all vocabulary content."
              action={
                <Button href="/admin/vocabulary/create" variant="primary" icon="create">
                  Create vocabulary set
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
                <DataTableHeaderCell>Mode</DataTableHeaderCell>
                <DataTableHeaderCell>Items</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Theme</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableHeaderRow>
            </DataTableHead>

            <DataTableBody>
              {vocabularySets.map((vocabularySet) => (
                <DataTableRow key={vocabularySet.id}>
                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="app-heading-card">{vocabularySet.title}</div>
                      <div className="app-text-caption">
                        {vocabularySet.slug ?? vocabularySet.id}
                      </div>
                      <div className="max-w-md app-text-body-muted">
                        {vocabularySet.description ?? "No description yet."}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge tone="muted">
                          {getVocabularySetTypeLabel(vocabularySet.set_type)}
                        </Badge>
                        <Badge tone="muted">
                          {getVocabularyDisplayVariantLabel(
                            vocabularySet.default_display_variant
                          )}
                        </Badge>
                      </div>
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge tone="info" icon="school">
                      {getVocabularyTierLabel(vocabularySet.tier)}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge tone="muted" icon="vocabularySet">
                      {getVocabularyListModeLabel(vocabularySet.list_mode)}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="font-semibold app-text-detail">
                      {vocabularySet.item_count}
                    </div>
                    <div className="app-text-caption">
                      {vocabularySet.list_count} list
                      {vocabularySet.list_count === 1 ? "" : "s"}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <PublishStatusBadge isPublished={vocabularySet.is_published} />
                  </DataTableCell>

                  <DataTableCell className="capitalize">
                    {getVocabularyThemeLabel(vocabularySet.theme_key)}
                  </DataTableCell>

                  <DataTableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={`/admin/vocabulary/${vocabularySet.id}/items`}
                        variant="secondary"
                        size="sm"
                        icon="list"
                      >
                        Items
                      </Button>
                      <Button
                        href={`/admin/vocabulary/${vocabularySet.id}/edit`}
                        variant="quiet"
                        size="sm"
                        icon="edit"
                      >
                        Edit
                      </Button>
                      <Button
                        href={getVocabularySetHref(vocabularySet)}
                        variant="quiet"
                        size="sm"
                        icon="preview"
                      >
                        View
                      </Button>
                      <form action={deleteVocabularySetAction}>
                        <input
                          type="hidden"
                          name="vocabularySetId"
                          value={vocabularySet.id}
                        />
                        <AdminConfirmButton
                          variant="danger"
                          icon="delete"
                          confirmMessage={`Delete ${vocabularySet.title}? This also deletes its items and list links.`}
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
