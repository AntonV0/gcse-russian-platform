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
import StatusBadge from "@/components/ui/status-badge";
import { getDueDateClass, getDueDateStatus } from "@/lib/assignment-status";
import {
  getLessonCompletionMap,
  getQuestionSetStartedMap,
} from "@/lib/assignment-progress";

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

function getSubmissionSummary(status?: "not_started" | "submitted" | "reviewed") {
  if (status === "reviewed") {
    return {
      title: "Reviewed",
      description: "Your teacher has reviewed this homework.",
    };
  }

  if (status === "submitted") {
    return {
      title: "Submitted",
      description: "Your homework has been submitted and is waiting for review.",
    };
  }

  return {
    title: "Not started",
    description: "You have not submitted this homework yet.",
  };
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

  const dueStatus = getDueDateStatus(assignment.due_at);
  const submissionSummary = getSubmissionSummary(submission?.status);

  const submittedFileUrl = await getSignedStorageUrl(
    "assignment-submissions",
    submission?.submitted_file_path ?? null
  );

  const lessonItems = items
    .filter((item) => item.item_type === "lesson" && item.lesson)
    .map((item) => item.lesson!);

  const questionSetIds = items
    .filter((item) => item.item_type === "question_set" && item.questionSet?.id)
    .map((item) => item.questionSet!.id);

  const [lessonProgressMap, questionSetMap] = await Promise.all([
    getLessonCompletionMap(lessonItems),
    getQuestionSetStartedMap(questionSetIds),
  ]);

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

      <div className="mb-6 space-y-4">
        <PageHeader
          title={assignment.title}
          description={assignment.instructions ?? undefined}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="mb-1 text-sm font-medium text-gray-900">Due date</p>
            <p className={`text-sm ${getDueDateClass(dueStatus)}`}>
              {formatDueDate(assignment.due_at)}
              {dueStatus === "overdue" ? " (Overdue)" : ""}
              {dueStatus === "soon" ? " (Due soon)" : ""}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-1 text-sm font-medium text-gray-900">Submission status</p>
            <div className="mb-2">
              <StatusBadge status={submission?.status} />
            </div>
            <p className="text-sm text-gray-600">{submissionSummary.description}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-1 text-sm font-medium text-gray-900">Homework settings</p>
            <p className="text-sm text-gray-600">
              {assignment.allow_file_upload
                ? "File upload is allowed for this assignment."
                : "Text submission only for this assignment."}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <DashboardCard title="Assignment items">
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No items attached to this assignment.</p>
          ) : (
            <ol className="space-y-3 text-sm">
              {items.map((item, index) => {
                let progressLabel: string | null = null;
                let progressColor = "text-gray-500";

                if (item.item_type === "lesson" && item.lesson) {
                  const key = `${item.lesson.course_slug}|${item.lesson.variant_slug}|${item.lesson.module_slug}|${item.lesson.slug}`;
                  const completed = lessonProgressMap.get(key);

                  progressLabel = completed ? "Completed" : "Not completed";
                  progressColor = completed ? "text-green-600" : "text-gray-500";
                }

                if (item.item_type === "question_set" && item.questionSet) {
                  const started = questionSetMap.get(item.questionSet.id);

                  progressLabel = started ? "Started" : "Not started";
                  progressColor = started ? "text-blue-600" : "text-gray-500";
                }

                return (
                  <li key={item.id} className="rounded border p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Step {index + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {item.item_type.replace("_", " ")}
                        </span>

                        {progressLabel ? (
                          <span className={`text-xs font-medium ${progressColor}`}>
                            {progressLabel}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {item.item_type === "lesson" && item.lesson ? (
                      <>
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
                      </>
                    ) : null}

                    {item.item_type === "question_set" && item.questionSet?.slug ? (
                      <>
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
                      </>
                    ) : null}

                    {item.item_type === "custom_task" ? (
                      <p className="text-gray-700">
                        {item.custom_prompt ?? "No task text provided."}
                      </p>
                    ) : null}

                    {!["lesson", "question_set", "custom_task"].includes(
                      item.item_type
                    ) ? (
                      <p className="text-gray-700">Assignment item</p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </DashboardCard>
      </section>

      {submittedFileUrl && submission?.submitted_file_name ? (
        <section className="mb-6">
          <DashboardCard title="Your uploaded file">
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
            status={submission?.status}
            mark={submission?.mark}
            feedback={submission?.feedback}
          />
        </DashboardCard>
      </section>

      {submission?.status === "reviewed" ||
      submission?.feedback ||
      submission?.mark != null ? (
        <section>
          <DashboardCard title="Review result">
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium text-gray-900">Status</p>
                <StatusBadge status={submission?.status} />
              </div>

              {submission?.mark != null ? (
                <div>
                  <p className="mb-1 font-medium text-gray-900">Mark</p>
                  <p className="text-gray-700">{submission.mark}</p>
                </div>
              ) : null}

              <div>
                <p className="mb-1 font-medium text-gray-900">Teacher feedback</p>
                <p className="text-gray-700">
                  {submission?.feedback ?? "No feedback has been provided yet."}
                </p>
              </div>
            </div>
          </DashboardCard>
        </section>
      ) : null}
    </main>
  );
}
