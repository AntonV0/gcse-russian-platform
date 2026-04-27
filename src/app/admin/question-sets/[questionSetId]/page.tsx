import { QuestionSetAddQuestionPanel } from "@/components/admin/question-sets/question-set-add-question-panel";
import { QuestionSetDangerZone } from "@/components/admin/question-sets/question-set-danger-zone";
import { QuestionSetEditPanel } from "@/components/admin/question-sets/question-set-edit-panel";
import { QuestionSetOverviewPanel } from "@/components/admin/question-sets/question-set-overview-panel";
import { QuestionSetQuestionsPanel } from "@/components/admin/question-sets/question-set-questions-panel";
import { QuestionSetUsagePanel } from "@/components/admin/question-sets/question-set-usage-panel";
import PageHeader from "@/components/layout/page-header";
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
    return <main>Access denied.</main>;
  }

  const { questionSetId } = await params;

  const [questionSet, questions, usage] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
    getAssignmentsUsingQuestionSetDb(questionSetId),
  ]);

  if (!questionSet) {
    return <main>Question set not found.</main>;
  }

  return (
    <main>
      <PageHeader
        title={questionSet.title}
        description={questionSet.description ?? "Admin question set view."}
      />

      <section className="mb-8 grid gap-4">
        <QuestionSetOverviewPanel
          questionSet={questionSet}
          questionCount={questions.length}
        />
      </section>

      <section className="mb-8">
        <QuestionSetUsagePanel usage={usage} />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <QuestionSetEditPanel questionSet={questionSet} />
        <QuestionSetDangerZone questionSet={questionSet} usageCount={usage.length} />
      </section>

      <section className="mb-8">
        <QuestionSetQuestionsPanel
          questionSetId={questionSet.id}
          questions={questions}
        />
      </section>

      <section className="max-w-4xl">
        <QuestionSetAddQuestionPanel
          questionSetId={questionSet.id}
          nextPosition={questions.length + 1}
        />
      </section>
    </main>
  );
}
