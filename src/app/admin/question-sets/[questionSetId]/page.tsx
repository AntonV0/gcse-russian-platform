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
                  {question.metadata ? (
                    <pre className="overflow-x-auto rounded border bg-gray-50 p-3 text-xs text-gray-700">
                      {JSON.stringify(question.metadata, null, 2)}
                    </pre>
                  ) : null}
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

        <form action={createQuestionAction} className="space-y-6">
          <input type="hidden" name="questionSetId" value={questionSet.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Question type</label>
              <select
                name="questionType"
                required
                className="w-full rounded border px-3 py-2"
                defaultValue="translation"
              >
                <option value="multiple_choice">Multiple choice</option>
                <option value="short_answer">Short answer</option>
                <option value="translation">Translation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Answer strategy
              </label>
              <select
                name="answerStrategy"
                className="w-full rounded border px-3 py-2"
                defaultValue="text_input"
              >
                <option value="text_input">Text input</option>
                <option value="selection_based">Selection based</option>
                <option value="sentence_builder">Sentence builder</option>
                <option value="upload_required">Upload required</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Mainly used for translation and Russian-answer tasks.
              </p>
            </div>
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

          <DashboardCard title="Translation / Text Settings">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">
                  Translation direction
                </label>
                <select
                  name="translationDirection"
                  className="w-full rounded border px-3 py-2"
                  defaultValue=""
                >
                  <option value="">None</option>
                  <option value="to_russian">To Russian</option>
                  <option value="to_english">To English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Placeholder</label>
                <input
                  name="placeholder"
                  className="w-full rounded border px-3 py-2"
                  placeholder="Type your answer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Source language label
                </label>
                <input
                  name="sourceLanguageLabel"
                  className="w-full rounded border px-3 py-2"
                  placeholder="English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Target language label
                </label>
                <input
                  name="targetLanguageLabel"
                  className="w-full rounded border px-3 py-2"
                  placeholder="Russian"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Instruction</label>
              <input
                name="instruction"
                className="w-full rounded border px-3 py-2"
                placeholder="Translate into Russian"
              />
            </div>
          </DashboardCard>

          <DashboardCard title="Selection-Based Settings">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">
                  Selection display mode
                </label>
                <select
                  name="selectionDisplayMode"
                  className="w-full rounded border px-3 py-2"
                  defaultValue="grouped"
                >
                  <option value="grouped">Grouped</option>
                  <option value="inline_gaps">Inline gaps</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">
                Selection groups
              </label>
              <textarea
                name="selectionGroupsText"
                className="w-full rounded border px-3 py-2 font-mono text-sm"
                rows={8}
                placeholder={`subject|Choose subject|я,ты,он\nverb|Choose verb|живу,живёшь,живёт`}
              />
              <p className="mt-1 text-sm text-gray-500">
                One group per line: <code>id|label|option1,option2,option3</code>
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Sentence Builder Settings">
            <div>
              <label className="block text-sm font-medium">Word bank</label>
              <textarea
                name="wordBankText"
                className="w-full rounded border px-3 py-2"
                rows={5}
                placeholder={`я\nживу\nв\nлондоне`}
              />
              <p className="mt-1 text-sm text-gray-500">
                One token per line. Leave blank to auto-build from the primary accepted answer.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Validation Options">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="ignorePunctuation" value="true" />
                Ignore punctuation
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="ignoreArticles" value="true" />
                Ignore articles
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="collapseWhitespace"
                  value="true"
                  defaultChecked
                />
                Collapse whitespace
              </label>
            </div>
          </DashboardCard>

          <DashboardCard title="Listening Mode Settings">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Max plays</label>
                <input
                  name="maxPlays"
                  type="number"
                  min="1"
                  className="w-full rounded border px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="listeningMode" value="true" />
                Listening mode
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="autoPlay" value="true" />
                Auto play
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="hideNativeControls" value="true" />
                Hide native controls
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="requireAudioCompletionBeforeSubmit"
                  value="true"
                />
                Require audio completion before submit
              </label>
            </div>
          </DashboardCard>

          <DashboardCard title="Answer Content">
            <div className="space-y-4">
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
            </div>
          </DashboardCard>

          <DashboardCard title="Advanced Metadata Override">
            <div>
              <label className="block text-sm font-medium">
                Extra metadata JSON
              </label>
              <textarea
                name="metadata"
                className="w-full rounded border px-3 py-2 font-mono text-sm"
                rows={8}
                defaultValue={"{}"}
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional extra metadata merged on top of the structured fields above.
              </p>
            </div>
          </DashboardCard>

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