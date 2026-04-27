import MockExamAttemptMarkingForm from "@/components/admin/mock-exams/mock-exam-attempt-marking-form";
import {
  MockExamAttemptReviewHeader,
  MockExamAttemptReviewNotices,
  MockExamAttemptReviewSummary,
} from "@/components/admin/mock-exams/mock-exam-attempt-review-summary";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { loadMockExamAttemptReviewDb } from "@/lib/mock-exams/mock-exam-helpers-db";

type AdminMockExamAttemptReviewPageProps = {
  params: Promise<{
    attemptId: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
  }>;
};

export default async function AdminMockExamAttemptReviewPage({
  params,
  searchParams,
}: AdminMockExamAttemptReviewPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
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
    return <main>Mock exam attempt not found.</main>;
  }

  const questions = sections.flatMap((section) => questionsBySectionId[section.id] ?? []);
  const responseCount = Object.keys(responsesByQuestionId).length;
  const markedResponseCount = Object.values(responsesByQuestionId).filter(
    (response) => response.awarded_marks !== null
  ).length;
  const canMark = attempt.status !== "draft";

  return (
    <main className="space-y-4">
      <MockExamAttemptReviewHeader
        exam={exam}
        attempt={attempt}
        student={student}
        markedResponseCount={markedResponseCount}
        questionCount={questions.length}
      />

      <MockExamAttemptReviewNotices saved={query.saved === "1"} canMark={canMark} />

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
      />
    </main>
  );
}
