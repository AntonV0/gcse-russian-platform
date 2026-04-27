import MockExamDetailHeader from "@/components/admin/mock-exams/mock-exam-detail-header";
import MockExamSectionCreatePanel from "@/components/admin/mock-exams/mock-exam-section-create-panel";
import MockExamSectionsPanel from "@/components/admin/mock-exams/mock-exam-sections-panel";
import MockExamSettingsPanels from "@/components/admin/mock-exams/mock-exam-settings-panels";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getMockExamQuestionTypeLabel,
  loadMockExamByIdDb,
  mockExamQuestionTypes,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type AdminMockExamDetailPageProps = {
  params: Promise<{
    mockExamId: string;
  }>;
};

export default async function AdminMockExamDetailPage({
  params,
}: AdminMockExamDetailPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { mockExamId } = await params;
  const { exam, sections, questionsBySectionId } = await loadMockExamByIdDb(
    mockExamId
  );

  if (!exam) {
    return <main>Mock exam not found.</main>;
  }

  const questionCount = sections.reduce(
    (total, section) => total + (questionsBySectionId[section.id]?.length ?? 0),
    0
  );
  const questionTypeLabels = Object.fromEntries(
    mockExamQuestionTypes.map((questionType) => [
      questionType,
      getMockExamQuestionTypeLabel(questionType),
    ])
  ) as Record<(typeof mockExamQuestionTypes)[number], string>;

  return (
    <main className="space-y-4">
      <MockExamDetailHeader
        exam={exam}
        sectionCount={sections.length}
        questionCount={questionCount}
      />

      <MockExamSettingsPanels exam={exam} />
      <MockExamSectionCreatePanel mockExamId={exam.id} />
      <MockExamSectionsPanel
        mockExamId={exam.id}
        sections={sections}
        questionsBySectionId={questionsBySectionId}
        questionTypeLabels={questionTypeLabels}
      />
    </main>
  );
}
