import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCompactHeaderCell,
  DataTableHead,
  DataTableHeaderRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import TableShell from "@/components/ui/table-shell";
import type { AdminVocabularyListProps } from "@/components/admin/vocabulary/list/types";
import VocabularyFilterToolbar from "@/components/admin/vocabulary/list/vocabulary-filter-toolbar";
import VocabularyPagination from "@/components/admin/vocabulary/list/vocabulary-pagination";
import VocabularySetRow from "@/components/admin/vocabulary/list/vocabulary-set-row";
import {
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/shared/labels";

function getFilteredViewSummary({
  filters,
  totalItems,
}: Pick<AdminVocabularyListProps, "filters"> & { totalItems: number }) {
  const filterLabels: string[] = [];

  if (filters.setType && filters.setType !== "all") {
    filterLabels.push(
      filters.setType === "lesson_custom"
        ? "Lesson sets"
        : getVocabularySetTypeLabel(filters.setType)
    );
  }

  if (filters.tier && filters.tier !== "all") {
    filterLabels.push(getVocabularyTierLabel(filters.tier));
  }

  if (filters.themeKey) {
    filterLabels.push(getVocabularyThemeLabel(filters.themeKey));
  }

  if (filters.sourceKey) {
    filterLabels.push(filters.sourceKey);
  }

  if (filters.usageVariant && filters.usageVariant !== "all") {
    if (filters.usageVariant === "unused") {
      filterLabels.push("Unused");
    } else if (filters.usageVariant === "volna") {
      filterLabels.push("Used in Volna");
    } else {
      filterLabels.push(`Used in ${getVocabularyTierLabel(filters.usageVariant)}`);
    }
  }

  if (filters.published && filters.published !== "all") {
    filterLabels.push(filters.published === "published" ? "Published" : "Draft");
  }

  if (filters.search) {
    filterLabels.push(`Search: ${filters.search}`);
  }

  return filterLabels.length > 0
    ? `${totalItems} set${totalItems === 1 ? "" : "s"} matching ${filterLabels.join(" / ")}.`
    : `${totalItems} set${totalItems === 1 ? "" : "s"} in this view.`;
}

export default function VocabularySetsTable({
  vocabularySets,
  filters,
  params,
  themeKeys,
  sourceKeys,
  showVolnaUsageFilter,
  pagination,
}: AdminVocabularyListProps) {
  return (
    <TableShell
      title="Vocabulary sets"
      description="Find sets, manage items, and preview student-facing vocabulary."
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
      <VocabularyFilterToolbar
        filters={filters}
        params={params}
        themeKeys={themeKeys}
        sourceKeys={sourceKeys}
        showVolnaUsageFilter={showVolnaUsageFilter}
      />

      <div className="border-b border-[var(--border-subtle)] px-4 py-2 sm:px-5">
        <p className="app-text-caption">
          {getFilteredViewSummary({ filters, totalItems: pagination.totalItems })}
        </p>
      </div>

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
              <DataTableCompactHeaderCell>Set</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Items</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Usage</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Actions</DataTableCompactHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {vocabularySets.map((vocabularySet, index) => (
              <VocabularySetRow
                key={vocabularySet.id}
                rowNumber={pagination.startItem + index}
                filters={filters}
                vocabularySet={vocabularySet}
              />
            ))}
          </DataTableBody>
        </DataTable>
      )}

      <VocabularyPagination pagination={pagination} params={params} />
    </TableShell>
  );
}
