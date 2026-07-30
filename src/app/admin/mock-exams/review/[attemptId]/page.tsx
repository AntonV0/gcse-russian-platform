import MockExamAttemptMarkingForm from "@/components/admin/mock-exams/mock-exam-attempt-marking-form";
import {
  MockExamAttemptReviewHeader,
  MockExamAttemptReviewNotices,
  MockExamAttemptReviewSummary,
} from "@/components/admin/mock-exams/mock-exam-attempt-review-summary";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { loadMockExamAttemptReviewDb } from "@/lib/mock-exams/loaders";

type AdminMockExamAttemptReviewPageProps = {
  params: Promise<{
    attemptId: string;
  }>;
  searchParams?: Promise<{
    aiError?: string;
    aiMarked?: string;
    saved?: string;
  }>;
};

export default async function AdminMockExamAttemptReviewPage({
  params,
  searchParams,
}: AdminMockExamAttemptReviewPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Mock exam marking"
            title="Access denied"
            description="You do not have permission to review mock exam attempts."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const { attemptId } = await params;
  const query = (await searchParams) ?? {};
  const {
    attempt,
    exam,
    sections,
    questionsBySectionId,
    responsesByQuestionId,
    student,
    score,
  } = await loadMockExamAttemptReviewDb(attemptId);

  if (!attempt || !exam) {
    return (
      <main>
        <OperationsWorkspace>
          <OperationsHeader
            eyebrow="Mock exam marking"
            title="Attempt not found"
            description="This mock exam attempt could not be found or may have been removed."
          />
        </OperationsWorkspace>
      </main>
    );
  }

  const questions = sections.flatMap((section) => questionsBySectionId[section.id] ?? []);
  const responseCount = Object.keys(responsesByQuestionId).length;
  const markedResponseCount = Object.values(responsesByQuestionId).filter(
    (response) => response.awarded_marks !== null
  ).length;
  const canMark = attempt.status !== "draft";
  const canGenerateAiMarking = Boolean(process.env.OPENAI_API_KEY);
  const hasNotice =
    Boolean(query.aiError) ||
    Boolean(query.aiMarked) ||
    query.saved === "1" ||
    !canGenerateAiMarking ||
    !canMark;

  return (
    <main>
      <OperationsWorkspace>
        <MockExamAttemptReviewHeader
          exam={exam}
          attempt={attempt}
          student={student}
          markedResponseCount={markedResponseCount}
          questionCount={questions.length}
        />

        {hasNotice ? (
          <OperationsSection muted>
            <MockExamAttemptReviewNotices
              aiError={query.aiError}
              aiMarked={Boolean(query.aiMarked)}
              aiReady={canGenerateAiMarking}
              saved={query.saved === "1"}
              canMark={canMark}
            />
          </OperationsSection>
        ) : null}

        <OperationsSection>
          <div className="space-y-4">
            <MockExamAttemptReviewSummary
              attempt={attempt}
              student={student}
              score={score}
              responseCount={responseCount}
              questionCount={questions.length}
            />

            <MockExamAttemptMarkingForm
              attempt={attempt}
              sections={sections}
              questionsBySectionId={questionsBySectionId}
              responsesByQuestionId={responsesByQuestionId}
              score={score}
              canMark={canMark}
              canGenerateAiMarking={canGenerateAiMarking}
            />
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
