import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import AssignmentSubmissionForm from "@/components/assignments/assignment-submission-form";
import {
  getAssignmentItemsWithDetailsDb,
  getCurrentUserAssignmentSubmissionDb,
  getStudentAssignmentByIdDb,
} from "@/lib/assignment-helpers-db";
import { getLessonPath } from "@/lib/routes";
import { getSignedStorageUrl } from "@/lib/storage-helpers";

type AssignmentDetailPageProps = {
  params: Promise<{
    assignmentId: string;
  }>;
};

function formatDueDate(value: string | null) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSubmissionLabel(status: string | null | undefined) {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "reviewed":
      return "Reviewed";
    case "returned":
      return "Returned";
    default:
      return "Not started";
  }
}

export default async function AssignmentDetailPage({
  params,
}: AssignmentDetailPageProps) {
  const { assignmentId } = await params;

  const [assignment, items, submission] = await Promise.all([
    getStudentAssignmentByIdDb(assignmentId),
    getAssignmentItemsWithDetailsDb(assignmentId),
    getCurrentUserAssignmentSubmissionDb(assignmentId),
  ]);

  if (!assignment) {
    return <main>Assignment not found.</main>;
  }

  const submittedFileUrl = await getSignedStorageUrl(
    "assignment-submissions",
    submission?.submitted_file_path ?? null
  );

  return (
    <main>
      <div className="mb-6">
        <Link
          href="/assignments"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Back to assignments
        </Link>
      </div>

      <PageHeader
        title={assignment.title}
        description={assignment.instructions ?? undefined}
      />

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Due: {formatDueDate(assignment.due_at)}</span>
        <span>Status: {getSubmissionLabel(submission?.status)}</span>
        {assignment.allow_file_upload ? <span>File upload allowed</span> : null}
      </div>

      <section className="mb-6">
        <DashboardCard title="Assignment items">
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No items attached to this assignment.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {items.map((item) => {
                if (item.item_type === "lesson" && item.lesson) {
                  return (
                    <li key={item.id} className="rounded border p-3">
                      <p className="mb-1 font-medium">Lesson</p>
                      <Link
                        href={getLessonPath(
                          item.lesson.course_slug,
                          item.lesson.variant_slug,
                          item.lesson.module_slug,
                          item.lesson.slug
                        )}
                        className="text-blue-600 hover:underline"
                      >
                        {item.lesson.title}
                      </Link>
                      <p className="text-gray-600">{item.lesson.module_title}</p>
                    </li>
                  );
                }

                if (item.item_type === "question_set" && item.questionSet?.slug) {
                  return (
                    <li key={item.id} className="rounded border p-3">
                      <p className="font-medium">Question set</p>
                      <Link
                        href={`/question-sets/${item.questionSet.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.questionSet.title}
                      </Link>
                      {item.questionSet.description ? (
                        <p className="text-gray-700">{item.questionSet.description}</p>
                      ) : null}
                    </li>
                  );
                }

                if (item.item_type === "custom_task") {
                  return (
                    <li key={item.id} className="rounded border p-3">
                      <p className="mb-1 font-medium">Custom task</p>
                      <p className="text-gray-700">
                        {item.custom_prompt ?? "No task text provided."}
                      </p>
                    </li>
                  );
                }

                return (
                  <li key={item.id} className="rounded border p-3">
                    Assignment item
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardCard>
      </section>

      {submission?.submitted_file_name && submittedFileUrl ? (
        <section className="mb-6">
          <DashboardCard title="Uploaded file">
            <div className="space-y-2 text-sm">
              <p>{submission.submitted_file_name}</p>
              <Link
                href={submittedFileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open uploaded file
              </Link>
            </div>
          </DashboardCard>
        </section>
      ) : null}

      <section className="mb-6">
        <DashboardCard title="Submit homework">
          <AssignmentSubmissionForm
            assignmentId={assignment.id}
            initialValue={submission?.submitted_text ?? ""}
            initialFilePath={submission?.submitted_file_path ?? null}
            initialFileName={submission?.submitted_file_name ?? null}
            allowFileUpload={assignment.allow_file_upload}
          />
        </DashboardCard>
      </section>

      {submission?.feedback ? (
        <section>
          <DashboardCard title="Teacher feedback">
            <div className="space-y-2 text-sm">
              <p>{submission.feedback}</p>
              {submission.mark != null ? (
                <p className="font-medium">Mark: {submission.mark}</p>
              ) : null}
            </div>
          </DashboardCard>
        </section>
      ) : null}
    </main>
  );
}
