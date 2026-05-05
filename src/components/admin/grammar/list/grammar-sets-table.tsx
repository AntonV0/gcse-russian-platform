import GrammarFilterToolbar from "@/components/admin/grammar/list/grammar-filter-toolbar";
import GrammarPagination from "@/components/admin/grammar/list/grammar-pagination";
import GrammarSetRow from "@/components/admin/grammar/list/grammar-set-row";
import type { AdminGrammarListProps } from "@/components/admin/grammar/list/types";
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
import { getGrammarFilterLabel } from "@/components/admin/grammar/list/grammar-list-labels";

function getFilteredViewSummary({
  filters,
  totalItems,
}: Pick<AdminGrammarListProps, "filters"> & { totalItems: number }) {
  const filterLabels: string[] = [];

  if (filters.tier && filters.tier !== "all") {
    filterLabels.push(getGrammarFilterLabel({ key: "tier", value: filters.tier }));
  }

  if (filters.topicKey) {
    filterLabels.push(
      getGrammarFilterLabel({ key: "topic", value: filters.topicKey })
    );
  }

  if (filters.sourceKey) {
    filterLabels.push(
      getGrammarFilterLabel({ key: "source", value: filters.sourceKey })
    );
  }

  if (filters.usageVariant && filters.usageVariant !== "all") {
    filterLabels.push(
      getGrammarFilterLabel({ key: "usage", value: filters.usageVariant })
    );
  }

  if (filters.published && filters.published !== "all") {
    filterLabels.push(
      getGrammarFilterLabel({ key: "published", value: filters.published })
    );
  }

  if (filters.search) {
    filterLabels.push(getGrammarFilterLabel({ key: "search", value: filters.search }));
  }

  return filterLabels.length > 0
    ? `${totalItems} set${totalItems === 1 ? "" : "s"} matching ${filterLabels.join(" / ")}.`
    : `${totalItems} set${totalItems === 1 ? "" : "s"} in this view.`;
}

export default function GrammarSetsTable({
  grammarSets,
  filters,
  params,
  topicKeys,
  sourceKeys,
  contentHealthBySetId,
  pagination,
}: AdminGrammarListProps) {
  return (
    <TableShell
      title="Grammar sets"
      description="Search, filter, publish, and open grammar sets for point-level editing."
      actions={
        <Button href="/grammar" variant="secondary" icon="preview">
          Student view
        </Button>
      }
    >
      <GrammarFilterToolbar
        filters={filters}
        params={params}
        topicKeys={topicKeys}
        sourceKeys={sourceKeys}
      />

      <div className="border-b border-[var(--border-subtle)] px-4 py-2 sm:px-5">
        <p className="app-text-caption">
          {getFilteredViewSummary({ filters, totalItems: pagination.totalItems })}
        </p>
      </div>

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
              <DataTableCompactHeaderCell>Set</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Points</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Usage</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Coverage</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Status</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Actions</DataTableCompactHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {grammarSets.map((grammarSet, index) => (
              <GrammarSetRow
                key={grammarSet.id}
                rowNumber={pagination.startItem + index}
                filters={filters}
                grammarSet={grammarSet}
                contentHealth={contentHealthBySetId.get(grammarSet.id) ?? null}
              />
            ))}
          </DataTableBody>
        </DataTable>
      )}

      <GrammarPagination pagination={pagination} params={params} />
    </TableShell>
  );
}
