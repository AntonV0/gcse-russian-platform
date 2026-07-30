import { QuestionSetAddQuestionPanel } from "@/components/admin/question-sets/question-set-add-question-panel";
import { QuestionSetDangerZone } from "@/components/admin/question-sets/question-set-danger-zone";
import { QuestionSetEditPanel } from "@/components/admin/question-sets/question-set-edit-panel";
import { QuestionSetOverviewPanel } from "@/components/admin/question-sets/question-set-overview-panel";
import { QuestionSetQuestionsPanel } from "@/components/admin/question-sets/question-set-questions-panel";
import { QuestionSetUsagePanel } from "@/components/admin/question-sets/question-set-usage-panel";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import { getAssignmentsUsingQuestionSetDb } from "@/lib/assignments/assignment-helpers-db";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getQuestionSetByIdDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/questions/question-helpers-db";

type AdminQuestionSetDetailPageProps = {
  params: Promise<{
    questionSetId: string;
  }>;
};

export default async function AdminQuestionSetDetailPage({
  params,
}: AdminQuestionSetDetailPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Admin question bank"
            title="Access denied"
            description="You need an admin account to manage question sets."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const { questionSetId } = await params;

  const [questionSet, questions, usage] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
    getAssignmentsUsingQuestionSetDb(questionSetId),
  ]);

  if (!questionSet) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Admin question bank"
            title="Question set not found"
            description="This question set may have been deleted or the link may be out of date."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  return (
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Admin question bank"
          title={questionSet.title}
          description={questionSet.description ?? "Admin question set view."}
        />

        <OperationsSection>
          <QuestionSetOverviewPanel
            questionSet={questionSet}
            questionCount={questions.length}
          />
        </OperationsSection>

        <OperationsSection>
          <QuestionSetUsagePanel usage={usage} />
        </OperationsSection>

        <OperationsSection>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <QuestionSetEditPanel questionSet={questionSet} />
            <QuestionSetDangerZone questionSet={questionSet} usageCount={usage.length} />
          </div>
        </OperationsSection>

        <OperationsSection>
          <QuestionSetQuestionsPanel questionSetId={questionSet.id} questions={questions} />
        </OperationsSection>

        <OperationsSection>
          <div className="max-w-4xl">
            <QuestionSetAddQuestionPanel
              questionSetId={questionSet.id}
              nextPosition={questions.length + 1}
            />
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
