import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getQuestionSetByIdDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/question-helpers-db";
import Link from "next/link";
import AdminQuestionForm from "@/components/admin/admin-question-form";
import {
  createQuestionAction,
  deleteQuestionAction,
  deleteQuestionSetAction,
  duplicateQuestionAction,
  duplicateQuestionSetAction,
  moveQuestionAction,
  normalizeQuestionPositionsAction,
  toggleQuestionActiveAction,
  updateQuestionSetAction,
} from "@/app/actions/admin-question-actions";
import { getAssignmentsUsingQuestionSetDb } from "@/lib/assignment-helpers-db";

type AdminQuestionSetDetailPageProps = {
  params: Promise<{
    questionSetId: string;
  }>;
};

function formatQuestionType(value: string) {
  return value.replaceAll("_", " ");
}

export default async function AdminQuestionSetDetailPage({
  params,
}: AdminQuestionSetDetailPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { questionSetId } = await params;

  const [questionSet, questions, usage] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
    getAssignmentsUsingQuestionSetDb(questionSetId),
  ]);

  if (!questionSet) {
    return <main>Question set not found.</main>;
  }

  return (
    <main>
      <PageHeader
        title={questionSet.title}
        description={questionSet.description ?? "Admin question set view."}
      />

      <section className="mb-8 grid gap-4">
        <DashboardCard title="Question Set Details">
          <div className="space-y-2">
            <p>
              <span className="font-medium">ID:</span> {questionSet.id}
            </p>
            <p>
              <span className="font-medium">Slug:</span> {questionSet.slug ?? "—"}
            </p>
            <p>
              <span className="font-medium">Source type:</span> {questionSet.source_type}
            </p>
            {questionSet.instructions ? (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {questionSet.instructions}
              </p>
            ) : null}
            <p>
              <span className="font-medium">Questions:</span> {questions.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              href="/admin/question-sets"
              className="rounded border px-4 py-2 text-sm"
            >
              Back to all question sets
            </Link>

            {questionSet.is_template ? (
              <Link
                href={`/admin/question-sets/templates/${questionSet.id}/create`}
                className="rounded border px-4 py-2 text-sm"
              >
                Create from this template
              </Link>
            ) : null}

            <Link
              href="/admin/question-sets/templates"
              className="rounded border px-4 py-2 text-sm"
            >
              Open templates
            </Link>

            {questionSet.slug ? (
              <Link
                href={`/question-sets/${questionSet.slug}`}
                className="rounded border px-4 py-2 text-sm"
                target="_blank"
                rel="noreferrer"
              >
                Open public view
              </Link>
            ) : null}
          </div>
        </DashboardCard>
      </section>

      <section className="mb-8">
        <DashboardCard title="Usage">
          {usage.length === 0 ? (
            <p className="text-sm text-gray-600">
              This question set is not used in any assignments.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Used in {usage.length} assignment{usage.length > 1 ? "s" : ""}.
              </p>

              <ul className="space-y-2">
                {usage.map((assignment) => (
                  <li key={assignment.id}>
                    <Link
                      href={`/teacher/assignments/${assignment.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {assignment.title}
                    </Link>
                    <span className="ml-2 text-sm text-gray-500">
                      ({assignment.status})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DashboardCard>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Edit Question Set">
          <form action={updateQuestionSetAction} className="space-y-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />

            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                required
                defaultValue={questionSet.title}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input
                name="slug"
                required
                defaultValue={questionSet.slug ?? ""}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={questionSet.description ?? ""}
                className="w-full rounded border px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Instructions</label>
              <textarea
                name="instructions"
                defaultValue={questionSet.instructions ?? ""}
                className="w-full rounded border px-3 py-2"
                rows={3}
              />
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="mb-2 font-semibold">Template Settings</h2>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isTemplate"
                  value="true"
                  defaultChecked={Boolean(questionSet.is_template)}
                />
                This question set is a template
              </label>

              <div className="mt-4">
                <label className="block text-sm font-medium">Template type</label>
                <input
                  name="templateType"
                  defaultValue={questionSet.template_type ?? ""}
                  className="w-full rounded border px-3 py-2"
                  placeholder="translation_selection_based"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
                Save question set
              </button>
            </div>
          </form>

          <form action={duplicateQuestionSetAction} className="mt-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />
            <button type="submit" className="rounded-lg border px-4 py-2 text-sm">
              Duplicate question set
            </button>
          </form>
        </DashboardCard>

        <DashboardCard title="Danger Zone">
          <form action={deleteQuestionSetAction} className="space-y-4">
            <input type="hidden" name="questionSetId" value={questionSet.id} />

            <p className="text-sm text-gray-600">
              Delete this question set and all of its questions, options, and accepted
              answers.
            </p>

            {usage.length > 0 ? (
              <p className="text-sm text-red-600">
                Warning: This question set is used in {usage.length} assignment
                {usage.length > 1 ? "s" : ""}.
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-lg border border-red-300 px-4 py-2 text-red-700"
            >
              Delete question set
            </button>
          </form>
        </DashboardCard>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <PageHeader
            title="Questions"
            description="Questions currently attached to this set."
          />

          <form action={normalizeQuestionPositionsAction}>
            <input type="hidden" name="questionSetId" value={questionSet.id} />
            <button type="submit" className="rounded border px-3 py-2 text-sm">
              Normalize positions
            </button>
          </form>
        </div>
        {questions.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-gray-600">
            No questions yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => (
              <DashboardCard key={question.id} title={`Q${question.position}`}>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {formatQuestionType(question.question_type)}
                  </p>
                  <p>
                    <span className="font-medium">Prompt:</span> {question.prompt}
                  </p>
                  <p>
                    <span className="font-medium">Marks:</span> {question.marks}
                  </p>
                  <p>
                    <span className="font-medium">Active:</span>{" "}
                    {question.is_active ? "Yes" : "No"}
                  </p>
                  {question.audio_path ? (
                    <p>
                      <span className="font-medium">Audio path:</span>{" "}
                      {question.audio_path}
                    </p>
                  ) : null}
                  {question.metadata ? (
                    <pre className="overflow-x-auto rounded border bg-gray-50 p-3 text-xs text-gray-700">
                      {JSON.stringify(question.metadata, null, 2)}
                    </pre>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link
                      href={`/admin/questions/${question.id}`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      Edit question
                    </Link>

                    <form action={duplicateQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <button type="submit" className="rounded border px-3 py-1 text-sm">
                        Duplicate
                      </button>
                    </form>

                    <form action={moveQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        className="rounded border px-3 py-1 text-sm"
                        disabled={question.position === 1}
                      >
                        Move up
                      </button>
                    </form>

                    <form action={moveQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        className="rounded border px-3 py-1 text-sm"
                        disabled={question.position === questions.length}
                      >
                        Move down
                      </button>
                    </form>

                    <form action={toggleQuestionActiveAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <input
                        type="hidden"
                        name="nextState"
                        value={question.is_active ? "inactive" : "active"}
                      />
                      <button type="submit" className="rounded border px-3 py-1 text-sm">
                        {question.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>

                    <form action={deleteQuestionAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="questionSetId" value={questionSet.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-4xl">
        <PageHeader
          title="Add Question"
          description="Create a new question in this question set."
        />

        <AdminQuestionForm
          mode="create"
          action={createQuestionAction}
          questionSetId={questionSet.id}
          defaultValues={{
            questionType: "translation",
            answerStrategy: "text_input",
            marks: "1",
            position: String(questions.length + 1),
            collapseWhitespace: true,
            selectionDisplayMode: "grouped",
            metadata: "{}",
          }}
          submitLabel="Add question"
        />
      </section>
    </main>
  );
}
