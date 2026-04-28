import { notFound } from "next/navigation";
import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import MockExamResponseField from "@/components/mock-exams/mock-exam-response-field";
import MockExamResponseSummary from "@/components/mock-exams/mock-exam-response-summary";
import MockExamTimerPanel from "@/components/mock-exams/mock-exam-timer-panel";
import AttemptStatusBadge from "@/components/ui/attempt-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { saveMockExamAttemptResponsesAction } from "@/app/actions/mock-exams/mock-exam-attempt-actions";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
} from "@/lib/mock-exams/labels";
import { loadMockExamAttemptDb } from "@/lib/mock-exams/loaders";
import { getStudentSafeMockExamQuestion } from "@/lib/mock-exams/normalizers";
import { getMockExamScoreByAttemptIdDb } from "@/lib/mock-exams/queries";

type MockExamAttemptPageProps = {
  params: Promise<{
    mockExamSlug: string;
    attemptId: string;
  }>;
};

export default async function MockExamAttemptPage({ params }: MockExamAttemptPageProps) {
  const { mockExamSlug, attemptId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main>
        <EmptyState
          icon="user"
          iconTone="brand"
          title="Log in to view this attempt"
          description="Mock exam attempts are saved to your student account. Log in to continue or review your work."
          action={
            <Button href="/login" variant="primary" icon="user">
              Log in
            </Button>
          }
        />
      </main>
    );
  }

  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || exam.slug !== mockExamSlug || attempt.user_id !== user.id) {
    notFound();
  }

  const isDraft = attempt.status === "draft";
  const score = isDraft ? null : await getMockExamScoreByAttemptIdDb(attempt.id);
  const questionCount = sections.reduce(
    (total, section) => total + (questionsBySectionId[section.id]?.length ?? 0),
    0
  );
  const markedResponseCount = Object.values(responsesByQuestionId).filter(
    (response) => response.awarded_marks !== null
  ).length;
  const predictedGrade =
    typeof score?.score_payload.predictedGrade === "string"
      ? score.score_payload.predictedGrade
      : "";

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Mock exam attempt"
        title={exam.title}
        description={exam.description ?? "Original GCSE-style mock exam attempt."}
        badges={
          <>
            <Badge tone="info" icon="mockExam">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <AttemptStatusBadge status={attempt.status} />
            <Badge tone="muted">
              {attempt.time_limit_minutes_snapshot
                ? `${attempt.time_limit_minutes_snapshot} minutes`
                : "Untimed"}
            </Badge>
            <Badge tone="muted">{attempt.total_marks_snapshot} marks</Badge>
          </>
        }
        actions={
          <>
            <Button href={`/mock-exams/${exam.slug}`} variant="secondary" icon="back">
              Exam preview
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="mockExam">
              Mock exams
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone={isDraft ? "info" : "success"}
        title={isDraft ? "Draft attempt" : "Attempt submitted"}
        description={
          isDraft
            ? "Save draft responses while you work, then submit when you are ready for marking. Objective questions can be auto-marked on submission."
            : attempt.status === "marked"
              ? "This attempt has been marked. Review your score, feedback, and question-level comments below."
              : "This attempt has been submitted. Objective marks may be visible now; longer answers may still be awaiting teacher review."
        }
      />

      <MockExamTimerPanel
        startedAt={attempt.started_at}
        timeLimitMinutes={attempt.time_limit_minutes_snapshot}
        isDraft={isDraft}
      />

      {!isDraft ? (
        <SectionCard
          title="Results"
          description="Score and marking status for this attempt."
          tone="student"
          density="compact"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Score
              </div>
              <div className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {attempt.awarded_marks ?? "-"} / {attempt.total_marks_snapshot}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Marking
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)]">
                {markedResponseCount} / {questionCount} question
                {questionCount === 1 ? "" : "s"} marked
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Predicted grade
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)]">
                {predictedGrade || "Pending teacher review"}
              </div>
            </div>
          </div>

          {attempt.feedback || score?.feedback ? (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Feedback
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {attempt.feedback ?? score?.feedback}
              </p>
            </div>
          ) : null}
        </SectionCard>
      ) : null}

      {sections.length === 0 ? (
        <SectionCard
          title="No sections"
          description="This exam does not have attemptable sections yet."
          tone="student"
        >
          <EmptyState
            icon="list"
            iconTone="brand"
            title="Nothing to answer yet"
            description="Questions will appear once the mock exam has been built out."
          />
        </SectionCard>
      ) : (
        <form
          action={saveMockExamAttemptResponsesAction}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <input type="hidden" name="attemptId" value={attempt.id} />

          <div className="space-y-4">
            {sections.map((section) => {
              const questions = questionsBySectionId[section.id] ?? [];

              return (
                <SectionCard
                  key={section.id}
                  title={section.title}
                  description={section.instructions ?? undefined}
                  tone="student"
                  density="compact"
                  actions={
                    <Badge tone="muted" icon="list">
                      {getMockExamSectionTypeLabel(section.section_type)}
                    </Badge>
                  }
                >
                  {questions.length === 0 ? (
                    <EmptyState
                      icon="question"
                      iconTone="brand"
                      title="No questions in this section"
                      description="Questions will appear here once they have been added."
                    />
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question, questionIndex) => {
                        const response = responsesByQuestionId[question.id];
                        const studentSafeQuestion =
                          getStudentSafeMockExamQuestion(question);

                        return (
                          <div key={question.id} className="space-y-3">
                            <MockExamQuestionPreview
                              question={studentSafeQuestion}
                              index={questionIndex}
                            />

                            {isDraft ? (
                              <MockExamResponseField
                                question={studentSafeQuestion}
                                response={response}
                              />
                            ) : (
                              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
                                <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                                  Your response
                                </div>
                                <div className="mt-2">
                                  <MockExamResponseSummary response={response} />
                                </div>
                              </div>
                            )}

                            {response?.awarded_marks !== null &&
                            response?.awarded_marks !== undefined ? (
                              <div className="flex flex-wrap gap-2">
                                <Badge tone="info">
                                  Mark: {response.awarded_marks} / {question.marks}
                                </Badge>
                                {response.feedback ? (
                                  <Badge tone="muted">{response.feedback}</Badge>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SectionCard>
              );
            })}
          </div>

          {isDraft ? (
            <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="submit"
                name="submitIntent"
                value="save"
                variant="secondary"
                icon="save"
              >
                Save draft
              </Button>
              <Button
                type="submit"
                name="submitIntent"
                value="submit"
                variant="primary"
                icon="confirm"
              >
                Submit attempt
              </Button>
            </div>
          ) : null}
        </form>
      )}

      <SectionCard
        title="Attempt summary"
        description={`${questionCount} question${questionCount === 1 ? "" : "s"} in this attempt.`}
        tone="student"
        density="compact"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Started
            </div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {new Date(attempt.started_at).toLocaleString("en-GB")}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Status
            </div>
            <div className="mt-1 text-sm capitalize text-[var(--text-primary)]">
              {attempt.status}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Score
            </div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {attempt.awarded_marks ?? "-"} / {attempt.total_marks_snapshot}
            </div>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}
