import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import TeacherSubmissionReviewForm from "@/components/assignments/teacher-submission-review-form";
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button";
import TeacherAccessDenied from "@/components/assignments/teacher-access-denied";
import ReopenSubmissionButton from "@/components/assignments/reopen-submission-button";
import StatusBadge from "@/components/ui/status-badge";
import {
  getAssignmentByIdDb,
  getAssignmentItemsWithDetailsDb,
  getAssignmentSubmissionsForTeacherDb,
} from "@/lib/assignments/assignment-helpers-db";
import { getLessonPath } from "@/lib/access/routes";
import { canCurrentUserReviewAssignment } from "@/lib/auth/teacher-auth";
import { getSignedStorageUrl } from "@/lib/shared/storage-helpers";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignments/assignment-status";

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
    if (filter === "pending") {
      return submission.status !== "reviewed";
    }

    if (filter === "reviewed") {
      return submission.status === "reviewed";
    }

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

      if (aReviewed !== bReviewed) {
        return aReviewed - bReviewed;
      }

      return (
        getSubmittedAtTime(b.submission.submitted_at) -
        getSubmittedAtTime(a.submission.submitted_at)
      );
    }

    const aPending = a.submission.status === "reviewed" ? 1 : 0;
    const bPending = b.submission.status === "reviewed" ? 1 : 0;

    if (aPending !== bPending) {
      return aPending - bPending;
    }

    return (
      getSubmittedAtTime(b.submission.submitted_at) -
      getSubmittedAtTime(a.submission.submitted_at)
    );
  });

  return (
    <main>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/teacher/assignments"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            Back to assignments
          </Link>

          <PageHeader
            title={`Review: ${assignment.title}`}
            description={assignment.instructions ?? undefined}
          />
        </div>

        <div className="flex gap-2">
          <Link
            href={`/teacher/assignments/${assignment.id}/edit`}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Edit
          </Link>

          <DeleteAssignmentButton assignmentId={assignment.id} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="mb-1 text-sm font-medium text-gray-900">Due date</p>
          <p className={`text-sm ${getDueDateClass(dueStatus)}`}>
            {formatDueDate(assignment.due_at)}
            {dueStatus === "overdue" ? " (Overdue)" : ""}
            {dueStatus === "soon" ? " (Due soon)" : ""}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-1 text-sm font-medium text-gray-900">Assignment items</p>
          <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-1 text-sm font-medium text-gray-900">Pending review</p>
          <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-1 text-sm font-medium text-gray-900">Reviewed</p>
          <p className="text-2xl font-semibold text-green-600">{reviewedCount}</p>
        </div>
      </div>

      <section className="mb-6">
        <DashboardCard title="Assignment items">
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No items attached to this assignment.</p>
          ) : (
            <ol className="space-y-3 text-sm">
              {items.map((item, index) => {
                if (item.item_type === "lesson" && item.lesson) {
                  return (
                    <li key={item.id} className="rounded border p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Step {index + 1}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          Lesson
                        </span>
                      </div>

                      <Link
                        href={getLessonPath(
                          item.lesson.course_slug,
                          item.lesson.variant_slug,
                          item.lesson.module_slug,
                          item.lesson.slug
                        )}
                        className="text-base font-medium text-blue-600 hover:underline"
                      >
                        {item.lesson.title}
                      </Link>

                      <p className="mt-1 text-gray-600">{item.lesson.module_title}</p>
                    </li>
                  );
                }

                if (item.item_type === "question_set" && item.questionSet?.slug) {
                  return (
                    <li key={item.id} className="rounded border p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Step {index + 1}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          Question set
                        </span>
                      </div>

                      <Link
                        href={`/question-sets/${item.questionSet.slug}`}
                        className="text-base font-medium text-blue-600 hover:underline"
                      >
                        {item.questionSet.title}
                      </Link>

                      {item.questionSet.description ? (
                        <p className="mt-1 text-gray-700">
                          {item.questionSet.description}
                        </p>
                      ) : null}
                    </li>
                  );
                }

                if (item.item_type === "custom_task") {
                  return (
                    <li key={item.id} className="rounded border p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Step {index + 1}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          Custom task
                        </span>
                      </div>

                      <p className="text-gray-700">
                        {item.custom_prompt ?? "No task text provided."}
                      </p>
                    </li>
                  );
                }

                return (
                  <li key={item.id} className="rounded border p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Step {index + 1}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        Item
                      </span>
                    </div>

                    <p className="text-gray-700">Assignment item</p>
                  </li>
                );
              })}
            </ol>
          )}
        </DashboardCard>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <Link
              href={`/teacher/assignments/${assignment.id}?filter=all&sort=${sort}`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                filter === "all" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              All ({submissionsWithFiles.length})
            </Link>

            <Link
              href={`/teacher/assignments/${assignment.id}?filter=pending&sort=${sort}`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                filter === "pending" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Pending ({pendingCount})
            </Link>

            <Link
              href={`/teacher/assignments/${assignment.id}?filter=reviewed&sort=${sort}`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                filter === "reviewed" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Reviewed ({reviewedCount})
            </Link>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=pending_first`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                sort === "pending_first" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Pending first
            </Link>

            <Link
              href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=reviewed_first`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                sort === "reviewed_first" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Reviewed first
            </Link>

            <Link
              href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=newest`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                sort === "newest" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Newest
            </Link>

            <Link
              href={`/teacher/assignments/${assignment.id}?filter=${filter}&sort=oldest`}
              className={`rounded border px-3 py-1 text-sm hover:bg-gray-50 ${
                sort === "oldest" ? "bg-gray-100 font-medium" : ""
              }`}
            >
              Oldest
            </Link>
          </div>
        </div>

        {visibleSubmissions.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-gray-600">
            No submissions in this view.
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleSubmissions.map(({ submission, student, reviewer, fileUrl }) => {
              const isPending = submission.status !== "reviewed";
              const reviewerName = getProfileName(reviewer);

              return (
                <div
                  key={submission.id}
                  className={`transition ${isPending ? "border-l-4 border-yellow-400" : ""}`}
                >
                  <DashboardCard
                    title={
                      student?.display_name ||
                      student?.full_name ||
                      student?.email ||
                      "Student submission"
                    }
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={submission.status} />
                          {submission.mark != null ? (
                            <span className="text-sm font-medium text-gray-700">
                              Mark: {submission.mark}
                            </span>
                          ) : null}
                        </div>

                        <div className="text-right text-sm text-gray-600">
                          <p>Submitted: {formatDateTime(submission.submitted_at)}</p>

                          {submission.reviewed_at ? (
                            <p className="text-green-600">
                              Reviewed: {formatDateTime(submission.reviewed_at)}
                              {reviewerName ? ` by ${reviewerName}` : ""}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="rounded border bg-gray-50 p-3 text-sm">
                        <p className="mb-1 font-medium">Submission</p>
                        <p>{submission.submitted_text ?? "No text provided."}</p>
                      </div>

                      {submission.submitted_file_name && fileUrl ? (
                        <div className="rounded border bg-gray-50 p-3 text-sm">
                          <p className="mb-1 font-medium">Uploaded file</p>
                          <p>{submission.submitted_file_name}</p>
                          <Link
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Open file
                          </Link>
                        </div>
                      ) : null}

                      {submission.feedback ? (
                        <div className="rounded border bg-gray-50 p-3 text-sm">
                          <p className="mb-1 font-medium">Current feedback</p>
                          <p className="text-gray-700">{submission.feedback}</p>
                        </div>
                      ) : null}

                      {submission.status === "reviewed" ? (
                        <div className="border-t pt-3">
                          <ReopenSubmissionButton submissionId={submission.id} />
                        </div>
                      ) : null}

                      <div className="border-t pt-3">
                        <TeacherSubmissionReviewForm
                          submissionId={submission.id}
                          initialMark={submission.mark}
                          initialFeedback={submission.feedback}
                          initiallyOpen={submission.status !== "reviewed"}
                        />
                      </div>
                    </div>
                  </DashboardCard>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
