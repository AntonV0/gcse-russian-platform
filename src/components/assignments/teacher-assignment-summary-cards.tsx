import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignments/assignment-status";
import type { DbAssignment } from "@/lib/assignments/assignment-helpers-db";

import { formatAssignmentDueDate } from "./teacher-assignment-review-utils";

export default function TeacherAssignmentSummaryCards({
  assignment,
  itemCount,
  pendingCount,
  reviewedCount,
  className = "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
}: {
  assignment: DbAssignment;
  itemCount: number;
  pendingCount: number;
  reviewedCount: number;
  className?: string;
}) {
  const dueStatus = getDueDateStatus(assignment.due_at);

  return (
    <div className={className}>
      <SummaryStatCard
        title="Due date"
        value={
          <span className={`text-base ${getDueDateClass(dueStatus)}`}>
            {formatAssignmentDueDate(assignment.due_at)}
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
        tone={
          dueStatus === "overdue" ? "danger" : dueStatus === "soon" ? "warning" : "brand"
        }
        compact
      />
      <SummaryStatCard
        title="Assignment items"
        value={itemCount}
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
  );
}
