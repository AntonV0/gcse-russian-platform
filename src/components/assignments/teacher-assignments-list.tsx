"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardCard from "@/components/ui/dashboard-card";
import FormField from "@/components/ui/form-field";
import Select from "@/components/ui/select";
import StatusBadge from "@/components/ui/status-badge";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignments/assignment-status";
import type { TeacherAssignmentListItem } from "@/lib/assignments/assignment-helpers-db";

type TeacherFilterValue = "all" | "pending_review" | "reviewed" | "no_submissions";
type TeacherSortValue = "priority" | "due_date" | "newest" | "most_submissions";

type TeacherAssignmentsListProps = {
  assignments: TeacherAssignmentListItem[];
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTeacherAssignmentStatus(params: {
  submissionCount: number;
  reviewedSubmissionCount: number;
}) {
  const { submissionCount, reviewedSubmissionCount } = params;

  if (submissionCount === 0) {
    return {
      key: "no_submissions" as const,
      label: "No submissions",
      badgeStatus: null,
      isActive: false,
      priorityRank: 2,
    };
  }

  if (reviewedSubmissionCount >= submissionCount) {
    return {
      key: "reviewed" as const,
      label: "Reviewed",
      badgeStatus: "reviewed" as const,
      isActive: false,
      priorityRank: 3,
    };
  }

  return {
    key: "pending_review" as const,
    label: "Pending review",
    badgeStatus: "submitted" as const,
    isActive: true,
    priorityRank: 1,
  };
}

function getCreatedAtTime(value: string | null) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getDueAtTime(value: string | null) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export default function TeacherAssignmentsList({
  assignments,
}: TeacherAssignmentsListProps) {
  const [filter, setFilter] = useState<TeacherFilterValue>("all");
  const [sortBy, setSortBy] = useState<TeacherSortValue>("priority");

  const counts = useMemo(() => {
    return assignments.reduce(
      (acc, item) => {
        const status = getTeacherAssignmentStatus({
          submissionCount: item.submissionCount,
          reviewedSubmissionCount: item.reviewedSubmissionCount,
        });

        acc.all += 1;
        acc[status.key] += 1;
        return acc;
      },
      {
        all: 0,
        pending_review: 0,
        reviewed: 0,
        no_submissions: 0,
      }
    );
  }, [assignments]);

  const visibleAssignments = useMemo(() => {
    const filtered = assignments.filter((item) => {
      if (filter === "all") return true;

      const status = getTeacherAssignmentStatus({
        submissionCount: item.submissionCount,
        reviewedSubmissionCount: item.reviewedSubmissionCount,
      });

      return status.key === filter;
    });

    return [...filtered].sort((a, b) => {
      const statusA = getTeacherAssignmentStatus({
        submissionCount: a.submissionCount,
        reviewedSubmissionCount: a.reviewedSubmissionCount,
      });
      const statusB = getTeacherAssignmentStatus({
        submissionCount: b.submissionCount,
        reviewedSubmissionCount: b.reviewedSubmissionCount,
      });

      if (sortBy === "due_date") {
        return getDueAtTime(a.assignment.due_at) - getDueAtTime(b.assignment.due_at);
      }

      if (sortBy === "newest") {
        return (
          getCreatedAtTime(b.assignment.created_at) -
          getCreatedAtTime(a.assignment.created_at)
        );
      }

      if (sortBy === "most_submissions") {
        return b.submissionCount - a.submissionCount;
      }

      if (statusA.priorityRank !== statusB.priorityRank) {
        return statusA.priorityRank - statusB.priorityRank;
      }

      const dueComparison =
        getDueAtTime(a.assignment.due_at) - getDueAtTime(b.assignment.due_at);

      if (dueComparison !== 0) {
        return dueComparison;
      }

      return (
        getCreatedAtTime(b.assignment.created_at) -
        getCreatedAtTime(a.assignment.created_at)
      );
    });
  }, [assignments, filter, sortBy]);

  return (
    <div className="dev-marker-host relative space-y-4">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TeacherAssignmentsList"
          filePath="src/components/assignments/teacher-assignments-list.tsx"
          tier="semantic"
          componentRole="Teacher assignment management list with filter, sort, due-date, and review-status summaries"
          bestFor="Teacher workflows where assignment queues need to be scanned by review priority, due date, and submission activity."
          usageExamples={[
            "Teacher assignment dashboard",
            "Pending review queue",
            "Teaching group assignment list",
            "Assignment review workflow",
          ]}
          notes="Use for teacher assignment lists only. Do not use for student assignment cards or admin content tables."
        />
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <FormField label="Filter">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as TeacherFilterValue)}
            >
              <option value="all">All ({counts.all})</option>
              <option value="pending_review">
                Pending review ({counts.pending_review})
              </option>
              <option value="reviewed">Reviewed ({counts.reviewed})</option>
              <option value="no_submissions">
                No submissions ({counts.no_submissions})
              </option>
            </Select>
          </FormField>

          <FormField label="Sort by">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TeacherSortValue)}
            >
              <option value="priority">Priority</option>
              <option value="due_date">Due date</option>
              <option value="newest">Newest created</option>
              <option value="most_submissions">Most submissions</option>
            </Select>
          </FormField>
        </div>

        <p className="text-sm app-text-muted">
          Showing {visibleAssignments.length} of {assignments.length} assignments
        </p>
      </div>

      {visibleAssignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] p-6 text-sm app-text-muted">
          No assignments match the selected filter.
        </div>
      ) : (
        <section className="grid gap-4">
          {visibleAssignments.map(
            ({ assignment, group, submissionCount, reviewedSubmissionCount }) => {
              const teacherStatus = getTeacherAssignmentStatus({
                submissionCount,
                reviewedSubmissionCount,
              });
              const dueStatus = getDueDateStatus(assignment.due_at);

              return (
                <Link
                  key={assignment.id}
                  href={`/teacher/assignments/${assignment.id}`}
                  className="block"
                >
                  <div
                    className={`transition hover:-translate-y-0.5 ${
                      teacherStatus.isActive ? "border-l-4 border-yellow-400" : ""
                    }`}
                  >
                    <DashboardCard title={assignment.title}>
                      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                        {assignment.instructions ? (
                          <p>{assignment.instructions}</p>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-4 text-sm app-text-muted">
                          <span>Group: {group?.name ?? "Unknown group"}</span>
                          <span className={getDueDateClass(dueStatus)}>
                            Due: {formatDueDate(assignment.due_at)}
                            {dueStatus === "overdue" ? " (Overdue)" : ""}
                            {dueStatus === "soon" ? " (Due soon)" : ""}
                          </span>
                          <span>Submissions: {submissionCount}</span>
                          {teacherStatus.badgeStatus ? (
                            <StatusBadge status={teacherStatus.badgeStatus} />
                          ) : (
                            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--background-muted)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
                              {teacherStatus.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </DashboardCard>
                  </div>
                </Link>
              );
            }
          )}
        </section>
      )}
    </div>
  );
}
