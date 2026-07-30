import AssignmentSubmissionForm from "@/components/assignments/assignment-submission-form";
import AssignmentReviewTimeline from "@/components/assignments/assignment-review-timeline";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import InlineActions from "@/components/ui/inline-actions";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
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
    return "Your teacher has reviewed this assignment. Your response can no longer be edited.";
  }

  if (status === "submitted") {
    return "Your work is waiting for teacher review. You can resubmit until it is reviewed.";
  }

  return "Open the items below, then submit your response when you are ready.";
}

function getDueDateDescription(value: string | null, status: AssignmentSubmissionStatus) {
  if (status === "reviewed") {
    return "Kept for reference after teacher review.";
  }

  return getDueDateUrgency(value).description;
}

function getHeaderDescription(status: AssignmentSubmissionStatus) {
  if (status === "reviewed") {
    return "Review your teacher feedback and submitted work.";
  }

  if (status === "submitted") {
    return "Your work is submitted and waiting for teacher review.";
  }

  return "Complete the assigned work and submit your response when ready.";
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
          title="No work items yet"
          description="There is nothing to complete here yet. Check the instructions and ask your teacher if you think something is missing."
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
        <LearningSheet>
          <LearningSheetSection divided={false}>
            <EmptyState
              icon="assignments"
              iconTone="brand"
              title="Assignment unavailable"
              description="This assignment could not be found for your student account. It may have been removed or assigned to a different group."
              action={
                <Button href="/assignments" variant="secondary" icon="back">
                  Back to assignments
                </Button>
              }
            />
          </LearningSheetSection>
        </LearningSheet>
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
    <main data-workspace-kind="assignment-detail">
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Assignment"
        title={assignment.title}
        description={getHeaderDescription(status)}
        badges={<StatusBadge status={status} />}
      >
        <InlineActions>
          <Button href="/assignments" variant="quiet" size="sm" icon="back">
            Back to assignments
          </Button>
        </InlineActions>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            description={getDueDateDescription(assignment.due_at, status)}
            icon={
              status === "reviewed"
                ? "completed"
                : dueStatus === "overdue"
                  ? "warning"
                  : "calendar"
            }
            tone={
              status === "reviewed"
                ? "success"
                : dueStatus === "overdue"
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
              items.length === 0
                ? "No tasks attached yet."
                : items.length === 1
                  ? "One task to complete."
                  : "Tasks to complete in order."
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
      </LearningSheetHeader>

      {showDueUrgency ? (
        <LearningSheetSection muted>
        <FeedbackBanner
          tone={dueUrgency.tone}
          title={dueUrgency.title}
          description={dueUrgency.description}
        />
        </LearningSheetSection>
      ) : null}

      {submission?.status === "submitted" ? (
        <LearningSheetSection muted>
        <FeedbackBanner
          tone="info"
          title="Submitted for review"
          description="Your latest submission is saved. You can still update your response until your teacher reviews it."
        />
        </LearningSheetSection>
      ) : null}

      {submission?.status === "reviewed" ? (
        <LearningSheetSection muted>
        <FeedbackBanner
          tone="success"
          title="Reviewed by your teacher"
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
        </LearningSheetSection>
      ) : null}

      <LearningSheetSection>
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
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
