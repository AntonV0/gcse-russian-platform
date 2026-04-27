import PageHeader from "@/components/layout/page-header";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import TeacherAssignmentItemsPanel from "@/components/assignments/teacher-assignment-items-panel";
import TeacherAssignmentSubmissionsPanel from "@/components/assignments/teacher-assignment-submissions-panel";
import TeacherAssignmentSummaryCards from "@/components/assignments/teacher-assignment-summary-cards";
import { getSubmittedAtTime } from "@/components/assignments/teacher-assignment-review-utils";
import Button from "@/components/ui/button";
import InlineActions from "@/components/ui/inline-actions";
import {
  getAssignmentByIdDb,
  getAssignmentItemsWithDetailsDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignments/assignment-helpers-db";
import { canCurrentUserReviewAssignment } from "@/lib/auth/teacher-auth";
import { getSignedStorageUrl } from "@/lib/shared/storage-helpers";

type Props = {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
};

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

      <TeacherAssignmentSummaryCards
        assignment={assignment}
        itemCount={items.length}
        pendingCount={pendingCount}
        reviewedCount={reviewedCount}
        className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      />

      <TeacherAssignmentItemsPanel items={items} />

      <TeacherAssignmentSubmissionsPanel
        assignmentId={assignment.id}
        filter={filter}
        sort={sort}
        submissions={visibleSubmissions}
        pendingCount={pendingCount}
        reviewedCount={reviewedCount}
        initiallyOpenReviewForm={true}
      />
    </main>
  );
}
