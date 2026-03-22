import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getQuestionSetByIdDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/question-helpers-db";
import { createQuestionAction } from "@/app/actions/admin-question-actions";

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

  const [questionSet, questions] = await Promise.all([
    getQuestionSetByIdDb(questionSetId),
    getQuestionsByQuestionSetIdIncludingInactiveDb(questionSetId),
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
              <span className="font-medium">Source type:</span>{" "}
              {questionSet.source_type}
            </p>
            {questionSet.instructions ? (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {questionSet.instructions}
              </p>
            ) : null}
          </div>
        </DashboardCard>
      </section>

      <section className="mb-8">
        <PageHeader
          title="Questions"
          description="Questions currently attached to this set."
        />

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
                </div>
              </DashboardCard>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-3xl">
        <PageHeader
          title="Add Question"
          description="Create a new question in this question set."
        />

        <form action={createQuestionAction} className="space-y-4">
          <input type="hidden" name="questionSetId" value={questionSet.id} />

          <div>
            <label className="block text-sm font-medium">Question type</label>
            <select
              name="questionType"
              required
              className="w-full rounded border px-3 py-2"
              defaultValue="multiple_choice"
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="translation">Translation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Prompt</label>
            <textarea
              name="prompt"
              required
              className="w-full rounded border px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Explanation</label>
            <textarea
              name="explanation"
              className="w-full rounded border px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">Marks</label>
              <input
                name="marks"
                type="number"
                min="1"
                defaultValue="1"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Position</label>
              <input
                name="position"
                type="number"
                min="1"
                defaultValue={String(questions.length + 1)}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Audio path</label>
              <input
                name="audioPath"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Metadata (JSON)</label>
            <textarea
              name="metadata"
              className="w-full rounded border px-3 py-2 font-mono text-sm"
              rows={8}
              defaultValue={"{}"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Multiple choice options
            </label>
            <textarea
              name="optionsText"
              className="w-full rounded border px-3 py-2"
              rows={5}
              placeholder={`Option 1\nOption 2\nOption 3`}
            />
            <p className="mt-1 text-sm text-gray-500">
              One option per line. Used for multiple choice only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Correct option index
            </label>
            <input
              name="correctOptionIndex"
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2"
              placeholder="1"
            />
            <p className="mt-1 text-sm text-gray-500">
              1-based index for the correct multiple choice option.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Accepted answers
            </label>
            <textarea
              name="acceptedAnswersText"
              className="w-full rounded border px-3 py-2"
              rows={5}
              placeholder={`Answer 1\nAnswer 2`}
            />
            <p className="mt-1 text-sm text-gray-500">
              One accepted answer per line. Used for short answer and translation.
            </p>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Add question
          </button>
        </form>
      </section>
    </main>
  );
}