import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import PanelCard from "@/components/ui/panel-card";
import type {
  AssignmentSubmissionStatus,
  DbAssignmentSubmission,
} from "@/lib/assignments/assignment-helpers-db";
import type { AppIconKey } from "@/lib/shared/icons";

type TimelineState = "complete" | "active" | "upcoming";

type AssignmentReviewTimelineProps = {
  assignedAt: string | null;
  dueAt: string | null;
  submission: DbAssignmentSubmission | null;
  status: AssignmentSubmissionStatus;
};

function formatDateTime(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStateClasses(state: TimelineState) {
  switch (state) {
    case "complete":
      return {
        marker:
          "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]",
        line: "bg-[var(--success-border)]",
      };
    case "active":
      return {
        marker:
          "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
        line: "bg-[var(--warning-border)]",
      };
    case "upcoming":
    default:
      return {
        marker:
          "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)]",
        line: "bg-[var(--border)]",
      };
  }
}

function getStateBadge(state: TimelineState) {
  if (state === "complete") {
    return (
      <Badge tone="success" icon="completed">
        Done
      </Badge>
    );
  }

  if (state === "active") {
    return (
      <Badge tone="warning" icon="pending">
        Current
      </Badge>
    );
  }

  return (
    <Badge tone="muted" icon="pending">
      Next
    </Badge>
  );
}

export default function AssignmentReviewTimeline({
  assignedAt,
  dueAt,
  submission,
  status,
}: AssignmentReviewTimelineProps) {
  const submittedAt = formatDateTime(submission?.submitted_at ?? null);
  const reviewedAt = formatDateTime(submission?.reviewed_at ?? null);
  const dueLabel = formatDateTime(dueAt);
  const hasSubmission = status === "submitted" || status === "reviewed";
  const isReviewed = status === "reviewed";

  const items: Array<{
    title: string;
    description: string;
    state: TimelineState;
    icon: AppIconKey;
  }> = [
    {
      title: "Assigned",
      description: formatDateTime(assignedAt) ?? "Assignment added by your teacher.",
      state: "complete",
      icon: "assignments",
    },
    {
      title: "Due",
      description: dueLabel
        ? `Deadline: ${dueLabel}`
        : "No deadline has been set for this assignment.",
      state: hasSubmission ? "complete" : "active",
      icon: "calendar",
    },
    {
      title: "Submitted",
      description: submittedAt
        ? `Latest submission saved: ${submittedAt}`
        : "Save your response when your work is ready.",
      state: hasSubmission ? "complete" : "upcoming",
      icon: "upload",
    },
    {
      title: "Teacher review",
      description: reviewedAt
        ? `Reviewed: ${reviewedAt}`
        : hasSubmission
          ? "Your teacher can now review your work. You can resubmit until it is reviewed."
          : "Teacher feedback will appear after you submit your work.",
      state: isReviewed ? "complete" : hasSubmission ? "active" : "upcoming",
      icon: isReviewed ? "completed" : "feedback",
    },
  ];

  return (
    <PanelCard
      title="Review timeline"
      description={
        isReviewed
          ? "Your submission is reviewed and locked."
          : hasSubmission
            ? "Your latest submission is waiting for teacher review."
            : "Track the steps from assigned work to feedback."
      }
      tone="student"
      density="compact"
    >
      <ol className="space-y-4">
        {items.map((item, index) => {
          const classes = getStateClasses(item.state);

          return (
            <li key={item.title} className="relative flex gap-3">
              {index < items.length - 1 ? (
                <span
                  className={[
                    "absolute left-[0.93rem] top-8 h-[calc(100%+0.5rem)] w-px",
                    classes.line,
                  ].join(" ")}
                />
              ) : null}

              <span
                className={[
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  classes.marker,
                ].join(" ")}
              >
                <AppIcon icon={item.icon} size={15} />
              </span>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                  {getStateBadge(item.state)}
                </div>
                <p className="mt-1 app-text-body-muted">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </PanelCard>
  );
}
