import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import Select from "@/components/ui/select";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import PastPaperResourceRow from "@/components/admin/past-papers/past-paper-resource-row";
import {
  getPastPaperResourceTypeLabel,
  getPastPaperResourcesDb,
  getPastPaperTierLabel,
  pastPaperResourceTypes,
  pastPaperTiers,
  type PastPaperResourceFilters,
} from "@/lib/past-papers/past-paper-helpers-db";

type PastPaperResource = Awaited<ReturnType<typeof getPastPaperResourcesDb>>[number];

type PastPaperResourceTableProps = {
  resources: PastPaperResource[];
  filters: PastPaperResourceFilters;
  examSeriesOptions: string[];
  selectedExamSeries?: string;
};

export default function PastPaperResourceTable({
  resources,
  filters,
  examSeriesOptions,
  selectedExamSeries,
}: PastPaperResourceTableProps) {
  return (
    <TableShell
      title="Past paper resources"
      description="Filter official links, edit metadata, publish drafts, and delete outdated entries."
    >
      <TableToolbar>
        <form className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-[180px]">
            <Select name="examSeries" defaultValue={selectedExamSeries ?? ""}>
              <option value="">All series</option>
              {examSeriesOptions.map((examSeries) => (
                <option key={examSeries} value={examSeries}>
                  {examSeries}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full lg:max-w-[150px]">
            <Select
              name="paperNumber"
              defaultValue={String(filters.paperNumber ?? "all")}
            >
              <option value="all">All papers</option>
              <option value="1">Paper 1</option>
              <option value="2">Paper 2</option>
              <option value="3">Paper 3</option>
              <option value="4">Paper 4</option>
            </Select>
          </div>

          <div className="w-full lg:max-w-[170px]">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              {pastPaperTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getPastPaperTierLabel(tier)}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full lg:max-w-[220px]">
            <Select name="resourceType" defaultValue={filters.resourceType ?? "all"}>
              <option value="all">All resource types</option>
              {pastPaperResourceTypes.map((resourceType) => (
                <option key={resourceType} value={resourceType}>
                  {getPastPaperResourceTypeLabel(resourceType)}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full lg:max-w-[160px]">
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
            <Button href="/admin/past-papers" variant="quiet" size="sm" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </TableToolbar>

      {resources.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon="pastPapers"
            iconTone="brand"
            title="No past paper resources found"
            description="Add the first Pearson resource link, or clear the current filters."
          />
        </div>
      ) : (
        <DataTable>
          <DataTableHead>
            <DataTableHeaderRow>
              <DataTableHeaderCell>Resource</DataTableHeaderCell>
              <DataTableHeaderCell>Paper</DataTableHeaderCell>
              <DataTableHeaderCell>Type</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Access</DataTableHeaderCell>
              <DataTableHeaderCell>Actions</DataTableHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {resources.map((resource) => (
              <PastPaperResourceRow key={resource.id} resource={resource} />
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </TableShell>
  );
}
