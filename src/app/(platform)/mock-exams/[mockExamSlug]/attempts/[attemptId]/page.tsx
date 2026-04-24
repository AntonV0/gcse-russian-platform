import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import { saveMockExamAttemptResponsesAction } from "@/app/actions/mock-exams/mock-exam-attempt-actions";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
  loadMockExamAttemptDb,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamAttemptPageProps = {
  params: Promise<{
    mockExamSlug: string;
    attemptId: string;
  }>;
};

export default async function MockExamAttemptPage({
  params,
}: MockExamAttemptPageProps) {
  const { mockExamSlug, attemptId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <main>Log in to access this mock exam attempt.</main>;
  }

  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || exam.slug !== mockExamSlug || attempt.user_id !== user.id) {
    return <main>Mock exam attempt not found.</main>;
  }

  const isDraft = attempt.status === "draft";
  const questionCount = sections.reduce(
    (total, section) => total + (questionsBySectionId[section.id]?.length ?? 0),
    0
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Mock exam attempt"
        title={exam.title}
        description={exam.description ?? "Original GCSE-style mock exam attempt."}
        badges={
          <>
            <Badge tone="info" icon="file">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone={isDraft ? "warning" : "success"} icon="pending">
              {attempt.status}
            </Badge>
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
            <Button href="/mock-exams" variant="secondary" icon="exercise">
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
            ? "You can save draft responses or submit this attempt for later marking. Automatic scoring is not enabled for this foundation version."
            : "This attempt has been submitted. Editing is locked until a future review workflow is added."
        }
      />

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
        <form action={saveMockExamAttemptResponsesAction} className="space-y-4">
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

                        return (
                          <div key={question.id} className="space-y-3">
                            <MockExamQuestionPreview
                              question={question}
                              index={questionIndex}
                            />

                            <FormField label="Your response">
                              <Textarea
                                name={`response_${question.id}`}
                                rows={5}
                                defaultValue={response?.response_text ?? ""}
                                disabled={!isDraft}
                                placeholder="Type your answer here."
                              />
                            </FormField>
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
            <div className="flex flex-wrap gap-2">
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
