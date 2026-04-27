import ReopenSubmissionButton from "@/components/assignments/reopen-submission-button";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import StatusBadge from "@/components/ui/status-badge";
import type { TeacherSubmissionReviewCard } from "@/lib/assignments/assignment-helpers-db";

import {
  formatAssignmentDateTime,
  getProfileName,
} from "./teacher-assignment-review-utils";

export type TeacherSubmissionWithFile = TeacherSubmissionReviewCard & {
  fileUrl: string | null;
};

export default function TeacherAssignmentSubmissionsPanel({
  assignmentId,
  filter,
  sort,
  submissions,
  pendingCount,
  reviewedCount,
  initiallyOpenReviewForm = false,
}: {
  assignmentId: string;
  filter: string;
  sort: string;
  submissions: TeacherSubmissionWithFile[];
  pendingCount: number;
  reviewedCount: number;
  initiallyOpenReviewForm?: boolean;
}) {
  return (
    <PanelCard
      title="Submissions"
      description="Review student work, marks, feedback, and uploaded files."
      tone="student"
      contentClassName="space-y-5"
      actions={
        <InlineActions align="end">
          <Button
            href={`/teacher/assignments/${assignmentId}?filter=all&sort=${sort}`}
            variant={filter === "all" ? "primary" : "secondary"}
            size="sm"
          >
            All ({pendingCount + reviewedCount})
          </Button>
          <Button
            href={`/teacher/assignments/${assignmentId}?filter=pending&sort=${sort}`}
            variant={filter === "pending" ? "primary" : "secondary"}
            size="sm"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            href={`/teacher/assignments/${assignmentId}?filter=reviewed&sort=${sort}`}
            variant={filter === "reviewed" ? "primary" : "secondary"}
            size="sm"
          >
            Reviewed ({reviewedCount})
          </Button>
        </InlineActions>
      }
    >
      <InlineActions align="end">
        <Button
          href={`/teacher/assignments/${assignmentId}?filter=${filter}&sort=pending_first`}
          variant={sort === "pending_first" ? "primary" : "secondary"}
          size="sm"
        >
          Pending first
        </Button>
        <Button
          href={`/teacher/assignments/${assignmentId}?filter=${filter}&sort=reviewed_first`}
          variant={sort === "reviewed_first" ? "primary" : "secondary"}
          size="sm"
        >
          Reviewed first
        </Button>
        <Button
          href={`/teacher/assignments/${assignmentId}?filter=${filter}&sort=newest`}
          variant={sort === "newest" ? "primary" : "secondary"}
          size="sm"
        >
          Newest
        </Button>
        <Button
          href={`/teacher/assignments/${assignmentId}?filter=${filter}&sort=oldest`}
          variant={sort === "oldest" ? "primary" : "secondary"}
          size="sm"
        >
          Oldest
        </Button>
      </InlineActions>

      {submissions.length === 0 ? (
        <EmptyState
          icon="filter"
          title="No submissions in this view"
          description="Try switching to all submissions or changing the sort order."
        />
      ) : (
        <div className="grid gap-4">
          {submissions.map(({ submission, student, reviewer, fileUrl }) => {
            const isPending = submission.status !== "reviewed";
            const reviewerName = getProfileName(reviewer);
            const studentName =
              student?.display_name ||
              student?.full_name ||
              student?.email ||
              "Student submission";

            return (
              <PanelCard
                key={submission.id}
                title={studentName}
                tone="default"
                density="compact"
                className={isPending ? "border-l-4 border-l-[var(--warning)]" : ""}
                actions={
                  <InlineActions align="end">
                    <StatusBadge status={submission.status} />
                    {submission.mark != null ? (
                      <Badge tone="success" icon="completed">
                        Mark: {submission.mark}
                      </Badge>
                    ) : null}
                  </InlineActions>
                }
                contentClassName="space-y-4"
              >
                <div className="grid gap-3 text-sm app-text-muted md:grid-cols-2">
                  <div>Submitted: {formatAssignmentDateTime(submission.submitted_at)}</div>
                  {submission.reviewed_at ? (
                    <div className="text-[var(--success)]">
                      Reviewed: {formatAssignmentDateTime(submission.reviewed_at)}
                      {reviewerName ? ` by ${reviewerName}` : ""}
                    </div>
                  ) : null}
                </div>

                <PanelCard
                  title="Submission"
                  tone="muted"
                  density="compact"
                  contentClassName="text-sm leading-6 text-[var(--text-primary)]"
                >
                  {submission.submitted_text ?? "No text provided."}
                </PanelCard>

                {submission.submitted_file_name && fileUrl ? (
                  <PanelCard title="Uploaded file" tone="muted" density="compact">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-[var(--text-primary)]">
                        {submission.submitted_file_name}
                      </span>
                      <Button href={fileUrl} variant="secondary" size="sm" icon="upload">
                        Open file
                      </Button>
                    </div>
                  </PanelCard>
                ) : null}

                {submission.feedback ? (
                  <PanelCard
                    title="Current feedback"
                    tone="muted"
                    density="compact"
                    contentClassName="text-sm leading-6 text-[var(--text-primary)]"
                  >
                    {submission.feedback}
                  </PanelCard>
                ) : null}

                {submission.status === "reviewed" ? (
                  <div className="border-t border-[var(--border-subtle)] pt-4">
                    <ReopenSubmissionButton submissionId={submission.id} />
                  </div>
                ) : null}

                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <TeacherSubmissionReviewForm
                    submissionId={submission.id}
                    initialMark={submission.mark}
                    initialFeedback={submission.feedback}
                    initiallyOpen={
                      initiallyOpenReviewForm && submission.status !== "reviewed"
                    }
                  />
                </div>
              </PanelCard>
            );
          })}
        </div>
      )}
    </PanelCard>
  );
}
