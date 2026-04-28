import { MockExamCreatePanel } from "@/components/admin/mock-exams/mock-exam-create-panel";
import { MockExamSetsTable } from "@/components/admin/mock-exams/mock-exam-sets-table";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { mockExamTiers } from "@/lib/mock-exams/constants";
import { getMockExamSetsDb } from "@/lib/mock-exams/queries";
import type { MockExamFilters, MockExamTier } from "@/lib/mock-exams/types";

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

      <MockExamCreatePanel />
      <MockExamSetsTable exams={exams} filters={filters} />
    </main>
  );
}
