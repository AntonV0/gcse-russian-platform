import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import { deleteMockExamSetAction } from "@/app/actions/admin/admin-mock-exam-actions";
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
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import {
  getMockExamTierLabel,
  mockExamTiers,
  type DbMockExamSet,
  type MockExamFilters,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export function MockExamSetsTable({
  exams,
  filters,
}: {
  exams: DbMockExamSet[];
  filters: MockExamFilters;
}) {
  return (
    <TableShell
      title="Mock exam sets"
      description="Filter, open, publish, or delete original mock exam sets."
    >
      <MockExamFiltersToolbar filters={filters} />

      {exams.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon="mockExam"
            iconTone="brand"
            title="No mock exams found"
            description="Create the first mock exam set, or clear the current filters."
          />
        </div>
      ) : (
        <DataTable>
          <DataTableHead>
            <DataTableHeaderRow>
              <DataTableHeaderCell>Exam</DataTableHeaderCell>
              <DataTableHeaderCell>Paper</DataTableHeaderCell>
              <DataTableHeaderCell>Tier</DataTableHeaderCell>
              <DataTableHeaderCell>Timing</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Actions</DataTableHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {exams.map((exam) => (
              <MockExamSetRow key={exam.id} exam={exam} />
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </TableShell>
  );
}

function MockExamFiltersToolbar({ filters }: { filters: MockExamFilters }) {
  return (
    <TableToolbar>
      <form className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-[150px]">
          <Select name="paperNumber" defaultValue={String(filters.paperNumber ?? "all")}>
            <option value="all">All papers</option>
            <option value="1">Paper 1</option>
            <option value="2">Paper 2</option>
            <option value="3">Paper 3</option>
            <option value="4">Paper 4</option>
          </Select>
        </div>

        <div className="w-full lg:max-w-[180px]">
          <Select name="tier" defaultValue={filters.tier ?? "all"}>
            <option value="all">All tiers</option>
            {mockExamTiers.map((tier) => (
              <option key={tier} value={tier}>
                {getMockExamTierLabel(tier)}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full lg:max-w-[170px]">
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
          <Button href="/admin/mock-exams" variant="quiet" size="sm" icon="refresh">
            Reset
          </Button>
        </div>
      </form>
    </TableToolbar>
  );
}

function MockExamSetRow({ exam }: { exam: DbMockExamSet }) {
  return (
    <DataTableRow>
      <DataTableCell>
        <div className="space-y-1">
          <div className="font-semibold text-[var(--text-primary)]">{exam.title}</div>
          <div className="text-xs text-[var(--text-secondary)]">{exam.slug}</div>
          {exam.description ? (
            <div className="max-w-md text-sm text-[var(--text-secondary)]">
              {exam.description}
            </div>
          ) : null}
        </div>
      </DataTableCell>

      <DataTableCell>
        Paper {exam.paper_number}: {exam.paper_name}
      </DataTableCell>

      <DataTableCell>
        <Badge tone="info" icon="school">
          {getMockExamTierLabel(exam.tier)}
        </Badge>
      </DataTableCell>

      <DataTableCell>
        {exam.time_limit_minutes ? `${exam.time_limit_minutes} minutes` : "No limit"} |{" "}
        {exam.total_marks} marks
      </DataTableCell>

      <DataTableCell>
        <PublishStatusBadge isPublished={exam.is_published} />
      </DataTableCell>

      <DataTableCell>
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/mock-exams/${exam.id}`}
            variant="secondary"
            size="sm"
            icon="edit"
          >
            Open
          </Button>

          <form action={deleteMockExamSetAction}>
            <input type="hidden" name="mockExamId" value={exam.id} />
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              confirmMessage={`Delete ${exam.title}? This also deletes its sections and questions.`}
            >
              Delete
            </AdminConfirmButton>
          </form>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
