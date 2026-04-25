import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import { markMockExamAttemptAction } from "@/app/actions/admin/admin-mock-exam-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
  loadMockExamAttemptReviewDb,
  type DbMockExamResponse,
  type MockExamProfileSummary,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type AdminMockExamAttemptReviewPageProps = {
  params: Promise<{
    attemptId: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
  }>;
};

function getProfileLabel(profile: MockExamProfileSummary | null) {
  if (!profile) return "Unknown student";
  return profile.full_name || profile.display_name || profile.email || "Unnamed student";
}

function getPayloadPreview(response?: DbMockExamResponse) {
  if (!response) return "No response saved.";
  if (response.response_text) return response.response_text;
  if (Object.keys(response.response_payload).length === 0) return "No response saved.";
  return JSON.stringify(response.response_payload, null, 2);
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

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
  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId, student, score } =
    await loadMockExamAttemptReviewDb(attemptId);

  if (!attempt || !exam) {
    return <main>Mock exam attempt not found.</main>;
  }

  const questions = sections.flatMap((section) =>
    questionsBySectionId[section.id] ?? []
  );
  const responseCount = Object.keys(responsesByQuestionId).length;
  const markedResponseCount = Object.values(responsesByQuestionId).filter(
    (response) => response.awarded_marks !== null
  ).length;
  const canMark = attempt.status !== "draft";
  const predictedGrade = getString(score?.score_payload.predictedGrade);

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Mock exam marking"
        title={exam.title}
        description={`Review attempt by ${getProfileLabel(student)}.`}
        badges={
          <>
            <Badge tone="info" icon="file">
              {exam.paper_name}
            </Badge>
            <Badge tone="muted" icon="school">
              {getMockExamTierLabel(exam.tier)}
            </Badge>
            <Badge tone={attempt.status === "marked" ? "success" : "warning"} icon="pending">
              {attempt.status}
            </Badge>
            <Badge tone="muted">
              {markedResponseCount} / {questions.length} marked
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/mock-exams/review" variant="secondary" icon="back">
              Review queue
            </Button>
            <Button href={`/mock-exams/${exam.slug}/attempts/${attempt.id}`} variant="secondary" icon="preview">
              Student result
            </Button>
          </>
        }
      />

      {query.saved === "1" ? (
        <FeedbackBanner
          tone="success"
          title="Marks saved"
          description="The response marks, feedback, attempt score, and predicted grade note have been updated."
        />
      ) : null}

      {!canMark ? (
        <FeedbackBanner
          tone="warning"
          title="Draft attempt"
          description="This attempt has not been submitted yet. You can inspect saved responses, but marking is locked until submission."
        />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <PanelCard
          title="Attempt details"
          description="Submission state, score, and student information."
          tone="admin"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Student
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)]">
                {getProfileLabel(student)}
              </div>
              {student?.email ? (
                <div className="mt-1 text-xs text-[var(--text-secondary)]">
                  {student.email}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Score
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)]">
                {attempt.awarded_marks ?? "-"} / {attempt.total_marks_snapshot}
              </div>
              {predictedGrade ? (
                <div className="mt-1 text-xs text-[var(--text-secondary)]">
                  Predicted grade: {predictedGrade}
                </div>
              ) : null}
            </div>

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
                Submitted
              </div>
              <div className="mt-1 text-sm text-[var(--text-primary)]">
                {attempt.submitted_at
                  ? new Date(attempt.submitted_at).toLocaleString("en-GB")
                  : "-"}
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Review progress"
          description={`${responseCount} saved response${responseCount === 1 ? "" : "s"} for ${questions.length} question${questions.length === 1 ? "" : "s"}.`}
          tone="muted"
        >
          <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
            <p>
              Objective responses may already have auto-marked scores. Manual marks
              can override them before the attempt is finalised.
            </p>
            <p>
              Writing, speaking, role play, photo card, and translation responses
              need teacher judgement and original Volna/platform mark guidance.
            </p>
          </div>
        </PanelCard>
      </section>

      {sections.length === 0 ? (
        <SectionCard
          title="No sections"
          description="This attempt has no exam sections to review."
          tone="admin"
        >
          <EmptyState
            icon="list"
            iconTone="brand"
            title="Nothing to mark"
            description="Add sections and questions to the mock exam before attempts are reviewed."
          />
        </SectionCard>
      ) : (
        <form action={markMockExamAttemptAction} className="space-y-4">
          <input type="hidden" name="attemptId" value={attempt.id} />

          {sections.map((section) => {
            const sectionQuestions = questionsBySectionId[section.id] ?? [];

            return (
              <SectionCard
                key={section.id}
                title={section.title}
                description={section.instructions ?? undefined}
                tone="admin"
                density="compact"
                actions={
                  <Badge tone="muted" icon="list">
                    {getMockExamSectionTypeLabel(section.section_type)}
                  </Badge>
                }
              >
                {sectionQuestions.length === 0 ? (
                  <EmptyState
                    icon="question"
                    iconTone="brand"
                    title="No questions in this section"
                    description="There are no responses to review in this section."
                  />
                ) : (
                  <div className="space-y-4">
                    {sectionQuestions.map((question, questionIndex) => {
                      const response = responsesByQuestionId[question.id];

                      return (
                        <div
                          key={question.id}
                          className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
                        >
                          <MockExamQuestionPreview
                            question={question}
                            index={questionIndex}
                          />

                          {getString(question.data.markGuidance) ? (
                            <div className="rounded-xl border border-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] bg-[var(--info-soft)] px-4 py-3">
                              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                                Mark guidance
                              </div>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                                {getString(question.data.markGuidance)}
                              </p>
                            </div>
                          ) : null}

                          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                              Student response
                            </div>
                            <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                              {getPayloadPreview(response)}
                            </pre>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
                            <FormField label={`Marks / ${question.marks}`}>
                              <Input
                                name={`awardedMarks_${question.id}`}
                                type="number"
                                min="0"
                                max={String(question.marks)}
                                step="0.5"
                                defaultValue={
                                  response?.awarded_marks === null ||
                                  response?.awarded_marks === undefined
                                    ? ""
                                    : String(response.awarded_marks)
                                }
                                disabled={!canMark}
                              />
                            </FormField>

                            <FormField label="Feedback">
                              <Textarea
                                name={`feedback_${question.id}`}
                                rows={3}
                                defaultValue={response?.feedback ?? ""}
                                disabled={!canMark}
                              />
                            </FormField>
                          </div>

                          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <input
                              type="checkbox"
                              name={`isFlagged_${question.id}`}
                              value="true"
                              defaultChecked={response?.is_flagged ?? false}
                              disabled={!canMark}
                            />
                            Flag this response for follow-up
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            );
          })}

          <SectionCard
            title="Final score and feedback"
            description="Save overall feedback and an optional predicted grade note for the student's results view."
            tone="admin"
          >
            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <FormField label="Predicted grade">
                <Input
                  name="predictedGrade"
                  defaultValue={predictedGrade}
                  placeholder="e.g. Grade 7"
                  disabled={!canMark}
                />
              </FormField>

              <FormField label="Overall feedback">
                <Textarea
                  name="overallFeedback"
                  rows={4}
                  defaultValue={attempt.feedback ?? score?.feedback ?? ""}
                  disabled={!canMark}
                />
              </FormField>
            </div>

            {canMark ? (
              <div className="mt-4">
                <Button type="submit" variant="primary" icon="save">
                  Save marking
                </Button>
              </div>
            ) : null}
          </SectionCard>
        </form>
      )}
    </main>
  );
}
