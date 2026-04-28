import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import AttemptStatusBadge from "@/components/ui/attempt-status-badge";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import TableShell from "@/components/ui/table-shell";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getMockExamTierLabel } from "@/lib/mock-exams/labels";
import { getMockExamAttemptsForAdminReviewDb } from "@/lib/mock-exams/loaders";
import type { MockExamProfileSummary } from "@/lib/mock-exams/types";

function getProfileLabel(profile: MockExamProfileSummary | null) {
  if (!profile) return "Unknown student";
  return profile.full_name || profile.display_name || profile.email || "Unnamed student";
}

export default async function AdminMockExamReviewPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const attempts = await getMockExamAttemptsForAdminReviewDb();
  const submittedCount = attempts.filter(
    (item) => item.attempt.status === "submitted"
  ).length;
  const markedCount = attempts.filter((item) => item.attempt.status === "marked").length;
  const draftCount = attempts.filter((item) => item.attempt.status === "draft").length;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Mock exam marking"
        title="Attempt Review"
        description="Review submitted mock exams, adjust objective marks where needed, add manual marks, and publish final feedback."
        badges={
          <>
            <Badge tone="info" icon="submitted">
              {submittedCount} awaiting review
            </Badge>
            <Badge tone="success" icon="marked">
              {markedCount} marked
            </Badge>
            <Badge tone="muted" icon="history">
              {attempts.length} total
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/mock-exams" variant="secondary" icon="back">
              Mock exams
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="preview">
              Student view
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="info"
        title="Predicted grades"
        description="Predicted grades should be based on original platform mock exams and teacher judgement. Volna School students can receive predicted-grade guidance after official virtual mock exam sessions."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryStatCard
          title="Awaiting review"
          value={submittedCount}
          description="Submitted attempts not fully marked yet."
          icon="submitted"
          tone="info"
          compact
        />
        <SummaryStatCard
          title="Marked"
          value={markedCount}
          description="Attempts with final marks and feedback."
          icon="marked"
          tone="success"
          compact
        />
        <SummaryStatCard
          title="Drafts"
          value={draftCount}
          description="Started attempts that students have not submitted."
          icon="history"
          compact
        />
      </div>

      <TableShell
        title="Mock exam attempts"
        description="Open an attempt to review answers, mark responses, and finalise score information."
      >
        {attempts.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon="mockExam"
              iconTone="brand"
              title="No attempts yet"
              description="Student attempts will appear here once mock exams are started."
            />
          </div>
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderRow>
                <DataTableHeaderCell>Student</DataTableHeaderCell>
                <DataTableHeaderCell>Exam</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Score</DataTableHeaderCell>
                <DataTableHeaderCell>Submitted</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableHeaderRow>
            </DataTableHead>

            <DataTableBody>
              {attempts.map((item) => (
                <DataTableRow key={item.attempt.id}>
                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        {getProfileLabel(item.student)}
                      </div>
                      {item.student?.email ? (
                        <div className="text-xs text-[var(--text-secondary)]">
                          {item.student.email}
                        </div>
                      ) : null}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.exam?.title ?? "Deleted mock exam"}
                      </div>
                      {item.exam ? (
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="muted" icon="mockExam">
                            Paper {item.exam.paper_number}
                          </Badge>
                          <Badge tone="muted" icon="school">
                            {getMockExamTierLabel(item.exam.tier)}
                          </Badge>
                        </div>
                      ) : null}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <AttemptStatusBadge status={item.attempt.status} />
                  </DataTableCell>

                  <DataTableCell>
                    {item.attempt.awarded_marks ?? "-"} /{" "}
                    {item.attempt.total_marks_snapshot}
                    <div className="mt-1 text-xs text-[var(--text-secondary)]">
                      {item.markedResponseCount} / {item.responseCount} responses marked
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    {item.attempt.submitted_at
                      ? new Date(item.attempt.submitted_at).toLocaleString("en-GB")
                      : "-"}
                  </DataTableCell>

                  <DataTableCell>
                    <Button
                      href={`/admin/mock-exams/review/${item.attempt.id}`}
                      variant="secondary"
                      size="sm"
                      icon="edit"
                    >
                      Review
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </TableShell>
    </main>
  );
}
