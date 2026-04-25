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
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import {
  createMockExamSetAction,
  deleteMockExamSetAction,
} from "@/app/actions/admin/admin-mock-exam-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getMockExamSetsDb,
  getMockExamTierLabel,
  mockExamPaperNames,
  mockExamTiers,
  type MockExamFilters,
  type MockExamTier,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type AdminMockExamsPageProps = {
  searchParams?: Promise<{
    paperNumber?: string;
    tier?: string;
    published?: string;
  }>;
};

function normalizePaperNumberFilter(value?: string): MockExamFilters["paperNumber"] {
  const numberValue = Number(value);

  if ([1, 2, 3, 4].includes(numberValue)) {
    return numberValue;
  }

  return "all";
}

function normalizeTierFilter(value?: string): MockExamFilters["tier"] {
  if (mockExamTiers.includes(value as MockExamTier)) {
    return value as MockExamTier;
  }

  return "all";
}

function normalizePublishedFilter(value?: string): MockExamFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

export default async function AdminMockExamsPage({
  searchParams,
}: AdminMockExamsPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const filters: MockExamFilters = {
    paperNumber: normalizePaperNumberFilter(params.paperNumber),
    tier: normalizeTierFilter(params.tier),
    published: normalizePublishedFilter(params.published),
  };
  const allExams = await getMockExamSetsDb();
  const exams = await getMockExamSetsDb(filters);
  const publishedCount = allExams.filter((exam) => exam.is_published).length;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin exam editor"
        title="Mock Exams"
        description="Create original GCSE-style mock exam sets separate from official Pearson past paper links."
        badges={
          <>
            <Badge tone="info" icon="mockExam">
              Original content
            </Badge>
            <Badge tone="muted" icon="list">
              {allExams.length} exam{allExams.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="published">
              {publishedCount} published
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/mock-exams/review" variant="primary" icon="edit">
              Review attempts
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="preview">
              Student view
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="info"
        title="Pearson-style, not Pearson-copied"
        description="Use the Pearson Edexcel 1RU0 structure as a guide, but every internal mock exam question should be original content created for this platform."
      />

      <PanelCard
        title="Create mock exam set"
        description="Start with the paper identity and access settings. Sections and questions are added on the exam detail page."
        tone="admin"
      >
        <form action={createMockExamSetAction} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Title" required>
              <Input name="title" required placeholder="Foundation Paper 3 mock 1" />
            </FormField>

            <FormField label="Slug" required>
              <Input name="slug" required placeholder="foundation-paper-3-mock-1" />
            </FormField>

            <FormField label="Description">
              <Input
                name="description"
                placeholder="Original reading mock exam for revision."
              />
            </FormField>

            <FormField label="Paper number" required>
              <Select name="paperNumber" required defaultValue="3">
                <option value="1">Paper 1</option>
                <option value="2">Paper 2</option>
                <option value="3">Paper 3</option>
                <option value="4">Paper 4</option>
              </Select>
            </FormField>

            <FormField label="Paper name" required>
              <Select name="paperName" required defaultValue="Paper 3 Reading">
                {mockExamPaperNames.map((paperName) => (
                  <option key={paperName} value={paperName}>
                    {paperName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Tier" required>
              <Select name="tier" required defaultValue="foundation">
                {mockExamTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {getMockExamTierLabel(tier)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Time limit minutes">
              <Input name="timeLimitMinutes" type="number" min="1" />
            </FormField>

            <FormField label="Total marks">
              <Input name="totalMarks" type="number" min="0" step="0.5" defaultValue="0" />
            </FormField>

            <FormField label="Sort order">
              <Input name="sortOrder" type="number" min="0" defaultValue="0" />
            </FormField>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="isTrialVisible" value="true" />
              Trial visible
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="requiresPaidAccess" value="true" defaultChecked />
              Requires paid access
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="availableInVolna" value="true" defaultChecked />
              Volna visible
            </label>
          </div>

          <Button type="submit" variant="primary" icon="create">
            Create mock exam
          </Button>
        </form>
      </PanelCard>

      <TableShell
        title="Mock exam sets"
        description="Filter, open, publish, or delete original mock exam sets."
      >
        <TableToolbar>
          <form className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
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
                <DataTableRow key={exam.id}>
                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        {exam.title}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {exam.slug}
                      </div>
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
                    {exam.time_limit_minutes
                      ? `${exam.time_limit_minutes} minutes`
                      : "No limit"}{" "}
                    · {exam.total_marks} marks
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
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </TableShell>
    </main>
  );
}
