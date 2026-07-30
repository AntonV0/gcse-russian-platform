import MockExamDetailHeader from "@/components/admin/mock-exams/mock-exam-detail-header";
import MockExamSectionCreatePanel from "@/components/admin/mock-exams/mock-exam-section-create-panel";
import MockExamSectionsPanel from "@/components/admin/mock-exams/mock-exam-sections-panel";
import MockExamSettingsPanels from "@/components/admin/mock-exams/mock-exam-settings-panels";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { mockExamQuestionTypes } from "@/lib/mock-exams/constants";
import { getMockExamQuestionTypeLabel } from "@/lib/mock-exams/labels";
import { loadMockExamByIdDb } from "@/lib/mock-exams/loaders";

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
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Mock exam editor"
            title="Access denied"
            description="You do not have permission to edit mock exams."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const { mockExamId } = await params;
  const { exam, sections, questionsBySectionId } = await loadMockExamByIdDb(mockExamId);

  if (!exam) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Mock exam editor"
            title="Mock exam not found"
            description="This mock exam could not be found or may have been removed."
          />
        </OperationsWorkspace>
      </main>
    );
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
    <main>
      <OperationsWorkspace>
        <MockExamDetailHeader
          exam={exam}
          sectionCount={sections.length}
          questionCount={questionCount}
        />

        <OperationsSection>
          <div className="space-y-4">
            <MockExamSettingsPanels exam={exam} />
            <MockExamSectionCreatePanel mockExamId={exam.id} />
            <MockExamSectionsPanel
              mockExamId={exam.id}
              sections={sections}
              questionsBySectionId={questionsBySectionId}
              questionTypeLabels={questionTypeLabels}
            />
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
