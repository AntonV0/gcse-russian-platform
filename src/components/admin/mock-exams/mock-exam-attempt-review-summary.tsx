import AttemptStatusBadge from "@/components/ui/attempt-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import {
  getMockExamTierLabel,
  type DbMockExamAttempt,
  type DbMockExamScore,
  type DbMockExamSet,
  type MockExamProfileSummary,
} from "@/lib/mock-exams/mock-exam-helpers-db";
import {
  getMockExamProfileLabel,
  getString,
} from "@/components/admin/mock-exams/mock-exam-attempt-review-utils";

type MockExamAttemptReviewHeaderProps = {
  exam: DbMockExamSet;
  attempt: DbMockExamAttempt;
  student: MockExamProfileSummary | null;
  markedResponseCount: number;
  questionCount: number;
};

type MockExamAttemptReviewNoticesProps = {
  saved: boolean;
  canMark: boolean;
};

type MockExamAttemptReviewSummaryProps = {
  attempt: DbMockExamAttempt;
  student: MockExamProfileSummary | null;
  score: DbMockExamScore | null;
  responseCount: number;
  questionCount: number;
};

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString("en-GB") : "-";
}

export function MockExamAttemptReviewHeader({
  exam,
  attempt,
  student,
  markedResponseCount,
  questionCount,
}: MockExamAttemptReviewHeaderProps) {
  return (
    <PageIntroPanel
      tone="admin"
      eyebrow="Mock exam marking"
      title={exam.title}
      description={`Review attempt by ${getMockExamProfileLabel(student)}.`}
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
            {markedResponseCount} / {questionCount} marked
          </Badge>
        </>
      }
      actions={
        <>
          <Button href="/admin/mock-exams/review" variant="secondary" icon="back">
            Review queue
          </Button>
          <Button
            href={`/mock-exams/${exam.slug}/attempts/${attempt.id}`}
            variant="secondary"
            icon="preview"
          >
            Student result
          </Button>
        </>
      }
    />
  );
}

export function MockExamAttemptReviewNotices({
  saved,
  canMark,
}: MockExamAttemptReviewNoticesProps) {
  return (
    <>
      {saved ? (
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
    </>
  );
}

export function MockExamAttemptReviewSummary({
  attempt,
  student,
  score,
  responseCount,
  questionCount,
}: MockExamAttemptReviewSummaryProps) {
  const predictedGrade = getString(score?.score_payload.predictedGrade);

  return (
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
              {getMockExamProfileLabel(student)}
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
              {formatDateTime(attempt.started_at)}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Submitted
            </div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {formatDateTime(attempt.submitted_at)}
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Review progress"
        description={`${responseCount} saved response${responseCount === 1 ? "" : "s"} for ${questionCount} question${questionCount === 1 ? "" : "s"}.`}
        tone="muted"
      >
        <div className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
          <p>
            Objective responses may already have auto-marked scores. Manual marks can
            override them before the attempt is finalised.
          </p>
          <p>
            Writing, speaking, role play, photo card, and translation responses need
            teacher judgement and original Volna/platform mark guidance.
          </p>
        </div>
      </PanelCard>
    </section>
  );
}
