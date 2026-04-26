import PageHeader from "@/components/layout/page-header";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";
import ReopenSubmissionButton from "@/components/assignments/reopen-submission-button";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import StatusBadge from "@/components/ui/status-badge";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import {
  getAssignmentByIdDb,
  getAssignmentItemsWithDetailsDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignments/assignment-helpers-db";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignments/assignment-status";
import { getLessonPath } from "@/lib/access/routes";
import { canCurrentUserReviewAssignment } from "@/lib/auth/teacher-auth";
import { getSignedStorageUrl } from "@/lib/shared/storage-helpers";

type Props = {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
};

function formatDateTime(value: string | null) {
  if (!value) return "Not submitted";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmittedAtTime(value: string | null) {
  if (!value) return 0;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getProfileName(
  profile: {
    display_name: string | null;
    full_name: string | null;
    email: string | null;
  } | null
) {
  if (!profile) return null;
  return profile.display_name || profile.full_name || profile.email || null;
}

function getItemBadge(itemType: string) {
  if (itemType === "lesson") {
    return (
      <Badge tone="info" icon="lesson">
        Lesson
      </Badge>
    );
  }

  if (itemType === "question_set") {
    return (
      <Badge tone="warning" icon="question">
        Question set
      </Badge>
    );
  }

  if (itemType === "custom_task") {
    return (
      <Badge tone="muted" icon="write">
        Custom task
      </Badge>
    );
  }

  return (
    <Badge tone="muted" icon="assignments">
      Item
    </Badge>
  );
}

export default async function TeacherAssignmentReviewPage({
  params,
  searchParams,
}: Props) {
  const { assignmentId } = await params;
  const { filter = "all", sort = "pending_first" } = await searchParams;

  const canReview = await canCurrentUserReviewAssignment(assignmentId);

  if (!canReview) {
    return <TeacherAccessDenied />;
  }

  const [assignment, items, submissions] = await Promise.all([
    getAssignmentByIdDb(assignmentId),
    getAssignmentItemsWithDetailsDb(assignmentId),
    getAssignmentSubmissionsForTeacherDb(assignmentId),
  ]);

  if (!assignment) {
    return <main>Assignment not found.</main>;
  }

  const dueStatus = getDueDateStatus(assignment.due_at);

  const submissionsWithFiles = await Promise.all(
    submissions.map(async ({ submission, student, reviewer }) => {
      const fileUrl = await getSignedStorageUrl(
        "assignment-submissions",
        submission.submitted_file_path ?? null
      );

      return {
        submission,
        student,
        reviewer,
        fileUrl,
      };
    })
  );

  const pendingCount = submissionsWithFiles.filter(
    ({ submission }) => submission.status !== "reviewed"
  ).length;
  const reviewedCount = submissionsWithFiles.length - pendingCount;

  const filteredSubmissions = submissionsWithFiles.filter(({ submission }) => {
    if (filter === "pending") return submission.status !== "reviewed";
    if (filter === "reviewed") return submission.status === "reviewed";
    return true;
  });

  const visibleSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sort === "newest") {
      return (
        getSubmittedAtTime(b.submission.submitted_at) -
        getSubmittedAtTime(a.submission.submitted_at)
      );
    }

    if (sort === "oldest") {
      return (
        getSubmittedAtTime(a.submission.submitted_at) -
        getSubmittedAtTime(b.submission.submitted_at)
      );
    }

    if (sort === "reviewed_first") {
      const aReviewed = a.submission.status === "reviewed" ? 0 : 1;
      const bReviewed = b.submission.status === "reviewed" ? 0 : 1;

      if (aReviewed !== bReviewed) return aReviewed - bReviewed;

      return (
        getSubmittedAtTime(b.submission.submitted_at) -
        getSubmittedAtTime(a.submission.submitted_at)
      );
    }

    const aPending = a.submission.status === "reviewed" ? 1 : 0;
    const bPending = b.submission.status === "reviewed" ? 1 : 0;

    if (aPending !== bPending) return aPending - bPending;

    return (
      getSubmittedAtTime(b.submission.submitted_at) -
      getSubmittedAtTime(a.submission.submitted_at)
    );
  });

  return (
    <main>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <InlineActions>
            <Button href="/teacher/assignments" variant="quiet" size="sm" icon="back">
              Back to assignments
            </Button>
          </InlineActions>

          <PageHeader
            title={`Review: ${assignment.title}`}
            description={assignment.instructions ?? undefined}
          />
        </div>

        <InlineActions align="end">
          <Button
            href={`/teacher/assignments/${assignment.id}/edit`}
            variant="secondary"
            size="sm"
            icon="edit"
          >
            Edit
          </Button>

          <DeleteAssignmentButton assignmentId={assignment.id} />
        </InlineActions>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Due date"
          value={
            <span className={`text-base ${getDueDateClass(dueStatus)}`}>
              {formatDueDate(assignment.due_at)}
            </span>
          }
          description={
            dueStatus === "overdue"
              ? "Overdue"
              : dueStatus === "soon"
                ? "Due soon"
                : "Scheduled"
          }
          icon="calendar"
          tone={dueStatus === "overdue" ? "danger" : dueStatus === "soon" ? "warning" : "brand"}
          compact
        />
        <SummaryStatCard
          title="Assignment items"
          value={items.length}
          icon="assignments"
          compact
        />
        <SummaryStatCard
          title="Pending review"
          value={pendingCount}
          icon="pending"
          tone="warning"
          compact
        />
        <SummaryStatCard
          title="Reviewed"
          value={reviewedCount}
          icon="completed"
          tone="success"
          compact
        />
      </div>

      <PanelCard
        className="mb-6"
        title="Assignment items"
        description="The work students were asked to complete, in order."
        tone="student"
        contentClassName="space-y-3"
      >
        {items.length === 0 ? (
          <EmptyState
            icon="assignments"
            title="No items attached"
            description="This assignment does not have any lesson, question set, or custom task items yet."
          />
        ) : (
          <ol className="space-y-3">
            {items.map((item, index) => {
              if (item.item_type === "lesson" && item.lesson) {
                return (
                  <li key={item.id}>
                    <CardListItem
                      title={item.lesson.title}
                      subtitle={item.lesson.module_title}
                      badges={
                        <>
                          <Badge tone="muted" icon="list">
                            Step {index + 1}
                          </Badge>
                          {getItemBadge(item.item_type)}
                        </>
                      }
                      actions={
                        <Button
                          href={getLessonPath(
                            item.lesson.course_slug,
                            item.lesson.variant_slug,
                            item.lesson.module_slug,
                            item.lesson.slug
                          )}
                          variant="secondary"
                          size="sm"
                          icon="preview"
                        >
                          Open
                        </Button>
                      }
                    />
                  </li>
                );
              }

              if (item.item_type === "question_set" && item.questionSet?.slug) {
                return (
                  <li key={item.id}>
                    <CardListItem
                      title={item.questionSet.title}
                      subtitle={item.questionSet.description ?? undefined}
                      badges={
                        <>
                          <Badge tone="muted" icon="list">
                            Step {index + 1}
                          </Badge>
                          {getItemBadge(item.item_type)}
                        </>
                      }
                      actions={
                        <Button
                          href={`/question-sets/${item.questionSet.slug}`}
                          variant="secondary"
                          size="sm"
                          icon="preview"
                        >
                          Open
                        </Button>
                      }
                    />
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <CardListItem
                    title={
                      item.item_type === "custom_task"
                        ? "Custom task"
                        : "Assignment item"
                    }
                    subtitle={item.custom_prompt ?? "No task text provided."}
                    badges={
                      <>
                        <Badge tone="muted" icon="list">
                          Step {index + 1}
                        </Badge>
                        {getItemBadge(item.item_type)}
                      </>
                    }
                  />
                </li>
              );
            })}
          </ol>
        )}
      </PanelCard>

      <PanelCard
        title="Submissions"
        description="Review student work, marks, feedback, and uploaded files."
        tone="student"
        contentClassName="space-y-5"
        actions={
          <InlineActions align="end">
            <Button
              href={`/teacher/assignments/${assignment.id}?filter=all&sort=${sort}`}
              variant={filter === "all" ? "primary" : "secondary"}
              size="sm"
            >
              All ({submissionsWithFiles.length})
            </Button>
            <Button
              href={`/teacher/assignments/${assignment.id}?filter=pending&sort=${sort}`}
              variant={filter === "pending" ? "primary" : "secondary"}
              size="sm"
            >
              Pending ({pendingCount})
            </Button>
            <Button
              href={`/teacher/assignments/${assignment.id}?filter=reviewed&sort=${sort}`}
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
            href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=pending_first`}
            variant={sort === "pending_first" ? "primary" : "secondary"}
            size="sm"
          >
            Pending first
          </Button>
          <Button
            href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=reviewed_first`}
            variant={sort === "reviewed_first" ? "primary" : "secondary"}
            size="sm"
          >
            Reviewed first
          </Button>
          <Button
            href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=newest`}
            variant={sort === "newest" ? "primary" : "secondary"}
            size="sm"
          >
            Newest
          </Button>
          <Button
            href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=oldest`}
            variant={sort === "oldest" ? "primary" : "secondary"}
            size="sm"
          >
            Oldest
          </Button>
        </InlineActions>

        {visibleSubmissions.length === 0 ? (
          <EmptyState
            icon="filter"
            title="No submissions in this view"
            description="Try switching to all submissions or changing the sort order."
          />
        ) : (
          <div className="grid gap-4">
            {visibleSubmissions.map(({ submission, student, reviewer, fileUrl }) => {
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
                    <div>Submitted: {formatDateTime(submission.submitted_at)}</div>
                    {submission.reviewed_at ? (
                      <div className="text-[var(--success)]">
                        Reviewed: {formatDateTime(submission.reviewed_at)}
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
                        <Button
                          href={fileUrl}
                          variant="secondary"
                          size="sm"
                          icon="upload"
                        >
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
                    />
                  </div>
                </PanelCard>
              );
            })}
          </div>
        )}
      </PanelCard>
    </main>
  );
}
