import { notFound } from "next/navigation";
import MockExamAttemptForm, {
  type MockExamAttemptFormQuestion,
} from "@/components/mock-exams/mock-exam-attempt-form";
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
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";

type MockExamAttemptPageProps = {
  params: Promise<{
    mockExamSlug: string;
    attemptId: string;
  }>;
};

function hasSavedResponse(response?: DbMockExamResponse) {
  if (!response) return false;

  if (response.response_text?.trim()) return true;

  return Object.values(response.response_payload).some((value) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    return value !== null && value !== undefined;
  });
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function hasPersistedAttachment(response?: DbMockExamResponse) {
  const file = response?.response_payload.file;
  const audio = response?.response_payload.audio;

  return Boolean(
    (file && typeof file === "object" && !Array.isArray(file)) ||
    (audio && typeof audio === "object" && !Array.isArray(audio))
  );
}

function getQuestionAnchorId(questionId: string) {
  return `mock-exam-question-${questionId}`;
}

function getQuestionAnswerFieldNames(question: DbMockExamQuestion) {
  switch (question.question_type) {
    case "multiple_choice":
      return [`response_choice_${question.id}`];

    case "multiple_response":
      return [`response_choices_${question.id}`];

    case "matching":
      return getStringArray(question.data.prompts).map(
        (_, index) => `response_match_${question.id}_${index}`
      );

    case "sequencing": {
      const items = getStringArray(question.data.items);
      if (items.length === 0) return [`response_order_${question.id}`];

      return items.map((_, index) => `response_order_${question.id}_${index}`);
    }

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return getStringArray(question.data.statements).map(
        (_, index) => `response_statement_${question.id}_${index}`
      );

    case "gap_fill":
    case "note_completion": {
      const fields =
        question.question_type === "gap_fill"
          ? getRecordArray(question.data.gaps)
          : getRecordArray(question.data.fields);

      return fields.map((_, index) => `response_field_${question.id}_${index}`);
    }

    case "writing_task":
    case "simple_sentences":
    case "short_paragraph":
    case "extended_writing":
    case "translation_into_russian":
      return [
        `response_planning_notes_${question.id}`,
        `response_draft_${question.id}`,
        `response_file_${question.id}`,
      ];

    case "role_play":
    case "photo_card":
    case "conversation":
      return [
        `response_prep_notes_${question.id}`,
        `response_audio_data_${question.id}`,
        `response_audio_file_${question.id}`,
      ];

    default:
      return [`response_text_${question.id}`];
  }
}

function formatDateTime(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLatestSavedAt({
  attemptUpdatedAt,
  responses,
}: {
  attemptUpdatedAt: string;
  responses: DbMockExamResponse[];
}) {
  const timestamps = [
    attemptUpdatedAt,
    ...responses.map((response) => response.updated_at),
  ]
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  if (timestamps.length === 0) return "";

  return new Date(Math.max(...timestamps)).toISOString();
}

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
  const allQuestions = sections.flatMap(
    (section) => questionsBySectionId[section.id] ?? []
  );
  const questionCount = allQuestions.length;
  const markedResponseCount = allQuestions.filter((question) => {
    const response = responsesByQuestionId[question.id];
    return response?.awarded_marks !== null && response?.awarded_marks !== undefined;
  }).length;
  const savedResponseCount = allQuestions.filter((question) =>
    hasSavedResponse(responsesByQuestionId[question.id])
  ).length;
  const savedResponses = Object.values(responsesByQuestionId);
  const completionPercent =
    questionCount > 0 ? Math.round((savedResponseCount / questionCount) * 100) : 0;
  const scorePercent =
    !isDraft && attempt.awarded_marks !== null && attempt.total_marks_snapshot > 0
      ? Math.round((Number(attempt.awarded_marks) / attempt.total_marks_snapshot) * 100)
      : null;
  const predictedGrade =
    typeof score?.score_payload.predictedGrade === "string"
      ? score.score_payload.predictedGrade
      : "";
  const latestSavedAt = getLatestSavedAt({
    attemptUpdatedAt: attempt.updated_at,
    responses: savedResponses,
  });
  const lastSavedLabel = isDraft
    ? savedResponseCount > 0
      ? formatDateTime(latestSavedAt)
      : ""
    : formatDateTime(attempt.submitted_at ?? latestSavedAt);
  const progressSections = sections.map((section) => {
    const questions = questionsBySectionId[section.id] ?? [];

    return {
      id: section.id,
      title: section.title,
      typeLabel: getMockExamSectionTypeLabel(section.section_type),
      savedCount: questions.filter((question) =>
        hasSavedResponse(responsesByQuestionId[question.id])
      ).length,
      markedCount: questions.filter((question) => {
        const response = responsesByQuestionId[question.id];
        return response?.awarded_marks !== null && response?.awarded_marks !== undefined;
      }).length,
      questions: questions.map((question, questionIndex) => {
        const response = responsesByQuestionId[question.id];

        return {
          id: question.id,
          label: `Question ${questionIndex + 1}`,
          anchorId: getQuestionAnchorId(question.id),
          saved: hasSavedResponse(response),
          marked:
            response?.awarded_marks !== null && response?.awarded_marks !== undefined,
        };
      }),
    };
  });
  const attemptFormQuestions: MockExamAttemptFormQuestion[] = sections.flatMap(
    (section) =>
      (questionsBySectionId[section.id] ?? []).map((question, questionIndex) => ({
        label: `Question ${questionIndex + 1}`,
        sectionTitle: section.title,
        answerFieldNames: getQuestionAnswerFieldNames(question),
        persistedAttachmentSaved: hasPersistedAttachment(
          responsesByQuestionId[question.id]
        ),
      }))
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
            <Badge tone="muted" icon={isDraft ? "save" : "submitted"}>
              {isDraft
                ? lastSavedLabel
                  ? `Last saved ${lastSavedLabel}`
                  : "No draft saves yet"
                : lastSavedLabel
                  ? `Submitted ${lastSavedLabel}`
                  : "Submitted"}
            </Badge>
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
            ? `${savedResponseCount} of ${questionCount} responses saved. Save draft responses while you work, then submit when you are ready for marking.`
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

      <SectionCard
        title={isDraft ? "Attempt progress" : "Response overview"}
        description={
          isDraft
            ? "Use this checkpoint before submitting your work."
            : "A quick view of saved responses and marking progress."
        }
        tone="student"
        density="compact"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Responses saved
            </div>
            <div className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              {savedResponseCount} / {questionCount}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Completion
            </div>
            <div className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              {completionPercent}%
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Marked
            </div>
            <div className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              {markedResponseCount} / {questionCount}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={isDraft ? "Question navigator" : "Review navigator"}
        description={
          isDraft
            ? "Jump between sections and check which questions still need an answer."
            : "Jump back to each submitted response and marking note."
        }
        tone="student"
        density="compact"
        actions={
          <Badge
            tone={savedResponseCount === questionCount ? "success" : "warning"}
            icon={savedResponseCount === questionCount ? "completed" : "warning"}
          >
            {questionCount - savedResponseCount} unanswered
          </Badge>
        }
      >
        <nav className="space-y-3" aria-label="Mock exam question navigator">
          {progressSections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {section.title}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {section.savedCount} / {section.questions.length} answered
                    {!isDraft
                      ? ` | ${section.markedCount} / ${section.questions.length} marked`
                      : ""}
                  </div>
                </div>
                <Badge tone="muted" icon="list">
                  {section.typeLabel}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {section.questions.map((question) => (
                  <a
                    key={question.id}
                    href={`#${question.anchorId}`}
                    aria-label={`${section.title}, ${question.label}: ${
                      question.saved ? "answered" : "blank"
                    }${!isDraft && question.marked ? ", marked" : ""}`}
                    className={[
                      "inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                      question.saved
                        ? "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]"
                        : "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
                    ].join(" ")}
                  >
                    <span>{question.label}</span>
                    <span className="text-xs font-medium opacity-80">
                      {question.saved ? "answered" : "blank"}
                      {!isDraft && question.marked ? (
                        <>
                          <span aria-hidden="true"> | </span>
                          marked
                        </>
                      ) : null}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SectionCard>

      {!isDraft ? (
        <SectionCard
          title="Submitted review"
          description="Score, marking status, and teacher feedback for this attempt."
          tone="student"
          density="compact"
          actions={
            <Badge tone={attempt.status === "marked" ? "success" : "info"} icon="marked">
              {attempt.status === "marked" ? "Marked" : "Review in progress"}
            </Badge>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Awarded score
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold leading-none text-[var(--text-primary)]">
                  {attempt.awarded_marks ?? "-"}
                </span>
                <span className="pb-1 text-sm font-medium text-[var(--text-secondary)]">
                  / {attempt.total_marks_snapshot} marks
                </span>
              </div>

              {scorePercent !== null ? (
                <div className="mt-5">
                  <div
                    className="h-2 overflow-hidden rounded-full bg-[var(--background-elevated)]"
                    role="progressbar"
                    aria-label="Awarded score"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={scorePercent}
                  >
                    <div
                      className="h-full rounded-full bg-[var(--success-text)]"
                      style={{ width: `${Math.min(Math.max(scorePercent, 0), 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                    {scorePercent}% of available marks awarded
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                  Your final mark will appear here after teacher review.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
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

              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                  Submitted
                </div>
                <div className="mt-1 text-sm text-[var(--text-primary)]">
                  {lastSavedLabel || "Pending"}
                </div>
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
        <MockExamAttemptForm
          action={saveMockExamAttemptResponsesAction}
          attemptId={attempt.id}
          questions={attemptFormQuestions}
          showControls={isDraft}
        >
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
                        const responseSaved = hasSavedResponse(response);
                        const responseMarked =
                          response?.awarded_marks !== null &&
                          response?.awarded_marks !== undefined;
                        const questionAnchorId = getQuestionAnchorId(question.id);

                        return (
                          <div
                            key={question.id}
                            id={questionAnchorId}
                            className="scroll-mt-24 space-y-3"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge tone="muted" icon="question">
                                Question {questionIndex + 1}
                              </Badge>
                              <Badge
                                tone={responseSaved ? "success" : "warning"}
                                icon={responseSaved ? "save" : "pending"}
                              >
                                {responseSaved ? "Response saved" : "No response"}
                              </Badge>
                              {!isDraft ? (
                                <Badge
                                  tone={responseMarked ? "info" : "muted"}
                                  icon={responseMarked ? "marked" : "pending"}
                                >
                                  {responseMarked ? "Marked" : "Awaiting mark"}
                                </Badge>
                              ) : null}
                            </div>

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

                            {responseMarked ? (
                              <div className="space-y-2">
                                <Badge tone="info">
                                  Mark: {response.awarded_marks} / {question.marks}
                                </Badge>
                                {response.feedback ? (
                                  <p className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm app-text-muted">
                                    {response.feedback}
                                  </p>
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
        </MockExamAttemptForm>
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
