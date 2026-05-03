import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import TableShell from "@/components/ui/table-shell";
import type { AdminVocabularyListProps } from "@/components/admin/vocabulary/list/types";
import VocabularyFilterToolbar from "@/components/admin/vocabulary/list/vocabulary-filter-toolbar";
import VocabularySetRow from "@/components/admin/vocabulary/list/vocabulary-set-row";

export default function VocabularySetsTable({
  vocabularySets,
  filters,
  params,
  themeKeys,
  sourceKeys,
  showVolnaUsageFilter,
}: AdminVocabularyListProps) {
  return (
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
      <VocabularyFilterToolbar
        filters={filters}
        params={params}
        themeKeys={themeKeys}
        sourceKeys={sourceKeys}
        showVolnaUsageFilter={showVolnaUsageFilter}
      />

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
              <DataTableHeaderCell>Items</DataTableHeaderCell>
              <DataTableHeaderCell>Usage</DataTableHeaderCell>
              <DataTableHeaderCell>Actions</DataTableHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {vocabularySets.map((vocabularySet, index) => (
              <VocabularySetRow
                key={vocabularySet.id}
                rowNumber={index + 1}
                vocabularySet={vocabularySet}
              />
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </TableShell>
  );
}
