import AssignmentSubmissionForm from "@/components/assignments/assignment-submission-form";
import AssignmentReviewTimeline from "@/components/assignments/assignment-review-timeline";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import StatusBadge from "@/components/ui/status-badge";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getLessonPath } from "@/lib/access/routes";
import {
  getAssignmentItemsWithDetailsDb,
  getCurrentUserAssignmentSubmissionDb,
  getStudentAssignmentByIdDb,
} from "@/lib/assignments/assignment-helpers-db";
import type { AssignmentSubmissionStatus } from "@/lib/assignments/assignment-helpers-db";
import { getDueDateStatus, getDueDateUrgency } from "@/lib/assignments/assignment-status";
import { getSignedStorageUrl } from "@/lib/shared/storage-helpers";

type Props = {
  params: Promise<{ assignmentId: string }>;
};

type StudentAssignmentItem = Awaited<
  ReturnType<typeof getAssignmentItemsWithDetailsDb>
>[number];

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "Not submitted yet";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionStatus(submissionStatus?: AssignmentSubmissionStatus | null) {
  return submissionStatus ?? "not_started";
}

function getSubmissionDescription(status: AssignmentSubmissionStatus) {
  if (status === "reviewed") {
    return "Your teacher has reviewed this assignment. Your response is locked.";
  }

  if (status === "submitted") {
    return "Your work is waiting for teacher review. You can resubmit until it is reviewed.";
  }

  return "Open the items below, then submit your response when you are ready.";
}

function getDueDateDescription(value: string | null) {
  return getDueDateUrgency(value).description;
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

function StudentAssignmentItemRow({
  item,
  index,
}: {
  item: StudentAssignmentItem;
  index: number;
}) {
  const stepBadge = (
    <Badge tone="muted" icon="list">
      Step {index + 1}
    </Badge>
  );

  if (item.item_type === "lesson" && item.lesson) {
    return (
      <CardListItem
        title={item.lesson.title}
        subtitle={item.lesson.module_title}
        badges={
          <>
            {stepBadge}
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
            Open lesson
          </Button>
        }
      />
    );
  }

  if (item.item_type === "question_set" && item.questionSet?.slug) {
    return (
      <CardListItem
        title={item.questionSet.title}
        subtitle={item.questionSet.description ?? undefined}
        badges={
          <>
            {stepBadge}
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
            Open questions
          </Button>
        }
      />
    );
  }

  return (
    <CardListItem
      title={item.item_type === "custom_task" ? "Teacher task" : "Assignment item"}
      subtitle={item.custom_prompt ?? "No task text provided."}
      badges={
        <>
          {stepBadge}
          {getItemBadge(item.item_type)}
        </>
      }
    />
  );
}

function StudentAssignmentItemsPanel({ items }: { items: StudentAssignmentItem[] }) {
  return (
    <PanelCard
      title="Assignment work"
      description="Complete these items in order before submitting your response."
      tone="student"
      contentClassName="space-y-3"
    >
      {items.length === 0 ? (
        <EmptyState
          icon="assignments"
          title="No items attached"
          description="Your teacher has not attached any lesson, question set, or custom task items to this assignment yet."
        />
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <StudentAssignmentItemRow item={item} index={index} />
            </li>
          ))}
        </ol>
      )}
    </PanelCard>
  );
}

export default async function StudentAssignmentDetailPage({ params }: Props) {
  const { assignmentId } = await params;

  const assignment = await getStudentAssignmentByIdDb(assignmentId);

  if (!assignment) {
    return (
      <main>
        <EmptyState
          icon="assignments"
          iconTone="brand"
          title="Assignment unavailable"
          description="This assignment could not be found for your student account. It may have been removed or assigned to a different group."
          action={
            <Button href="/assignments" variant="primary" icon="back">
              Back to assignments
            </Button>
          }
        />
      </main>
    );
  }

  const [items, submission] = await Promise.all([
    getAssignmentItemsWithDetailsDb(assignment.id),
    getCurrentUserAssignmentSubmissionDb(assignment.id),
  ]);

  const status = getSubmissionStatus(submission?.status);
  const dueStatus = getDueDateStatus(assignment.due_at);
  const dueUrgency = getDueDateUrgency(assignment.due_at);
  const showDueUrgency =
    status !== "reviewed" && (dueStatus === "overdue" || dueStatus === "soon");
  const submittedFileUrl = await getSignedStorageUrl(
    "assignment-submissions",
    submission?.submitted_file_path ?? null
  );

  return (
    <main>
      <div className="mb-6 space-y-4">
        <InlineActions>
          <Button href="/assignments" variant="quiet" size="sm" icon="back">
            Back to assignments
          </Button>
        </InlineActions>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <PageHeader
            title={assignment.title}
            description={
              assignment.instructions ?? "Review the tasks and submit your work."
            }
          />

          <div className="flex shrink-0 justify-start lg:justify-end">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryStatCard
            title="Status"
            value={
              status === "not_started"
                ? "To do"
                : status === "submitted"
                  ? "Awaiting review"
                  : "Reviewed"
            }
            description={getSubmissionDescription(status)}
            icon={
              status === "reviewed"
                ? "completed"
                : status === "submitted"
                  ? "upload"
                  : "pending"
            }
            tone={
              status === "reviewed"
                ? "success"
                : status === "submitted"
                  ? "warning"
                  : "default"
            }
            compact
          />
          <SummaryStatCard
            title="Due date"
            value={<span className="text-base">{formatDueDate(assignment.due_at)}</span>}
            description={getDueDateDescription(assignment.due_at)}
            icon={dueStatus === "overdue" ? "warning" : "calendar"}
            tone={
              dueStatus === "overdue"
                ? "danger"
                : dueStatus === "soon"
                  ? "warning"
                  : "info"
            }
            compact
          />
          <SummaryStatCard
            title="Work items"
            value={items.length}
            description={
              items.length === 1 ? "One task to complete." : "Tasks to complete in order."
            }
            icon="assignments"
            tone="brand"
            compact
          />
          <SummaryStatCard
            title="Submitted"
            value={
              submission?.submitted_at ? (
                <span className="text-base">
                  {formatDateTime(submission.submitted_at)}
                </span>
              ) : (
                "Not yet"
              )
            }
            description={
              status === "reviewed"
                ? "Your reviewed response is locked."
                : submission?.submitted_at
                  ? "You can update it until teacher review."
                  : "Submit below when ready."
            }
            icon="upload"
            compact
          />
        </div>
      </div>

      {showDueUrgency ? (
        <FeedbackBanner
          className="mb-6"
          tone={dueUrgency.tone}
          title={dueUrgency.title}
          description={dueUrgency.description}
        />
      ) : null}

      {submission?.status === "submitted" ? (
        <FeedbackBanner
          className="mb-6"
          tone="info"
          title="Submitted for review"
          description="Your latest submission is saved. You can still update your response until your teacher reviews it."
        />
      ) : null}

      {submission?.status === "reviewed" ? (
        <FeedbackBanner
          className="mb-6"
          tone="success"
          title="Reviewed and locked"
          description={
            submission.feedback
              ? submission.feedback
              : "Your teacher has reviewed this assignment. Your response can no longer be edited."
          }
        >
          {submission.mark !== null ? (
            <Badge tone="success" icon="marked">
              Mark: {submission.mark}
            </Badge>
          ) : null}
        </FeedbackBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <div className="space-y-6">
          <PanelCard
            title="Instructions"
            description="Read this before opening the work items."
            tone="student"
          >
            <p className="whitespace-pre-line app-text-body-muted">
              {assignment.instructions ??
                "Your teacher has not added extra instructions for this assignment."}
            </p>
          </PanelCard>

          <StudentAssignmentItemsPanel items={items} />
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
          <AssignmentReviewTimeline
            assignedAt={assignment.created_at}
            dueAt={assignment.due_at}
            submission={submission}
            status={status}
          />

          <AssignmentSubmissionForm
            assignmentId={assignment.id}
            initialValue={submission?.submitted_text ?? ""}
            initialFilePath={submission?.submitted_file_path ?? null}
            initialFileName={submission?.submitted_file_name ?? null}
            allowFileUpload={assignment.allow_file_upload}
            status={status}
            mark={submission?.mark ?? null}
            feedback={submission?.feedback ?? null}
          />

          {submission?.submitted_file_name ? (
            <PanelCard
              title="Submitted file"
              description="The latest file attached to this assignment."
              tone="muted"
              density="compact"
              actions={
                submittedFileUrl ? (
                  <Button
                    href={submittedFileUrl}
                    variant="secondary"
                    size="sm"
                    icon="preview"
                  >
                    Open file
                  </Button>
                ) : null
              }
            >
              <p className="break-words app-text-body-muted">
                {submission.submitted_file_name}
              </p>
            </PanelCard>
          ) : null}
        </div>
      </div>
    </main>
  );
}
