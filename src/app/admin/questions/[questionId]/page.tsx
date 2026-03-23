import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getAcceptedAnswersByQuestionIdDb,
  getQuestionByIdDb,
  getQuestionOptionsByQuestionIdDb,
  getQuestionSetByIdDb,
} from "@/lib/question-helpers-db";
import {
  deleteQuestionAction,
  updateQuestionAction,
} from "@/app/actions/admin-question-actions";

type AdminQuestionEditPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function stringifySelectionGroups(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((group) => {
      if (!group || typeof group !== "object") return null;

      const record = group as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const label = typeof record.label === "string" ? record.label : "";
      const options = Array.isArray(record.options)
        ? record.options.filter((item): item is string => typeof item === "string")
        : [];

      if (!id || options.length === 0) return null;

      return `${id}|${label}|${options.join(",")}`;
    })
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export default async function AdminQuestionEditPage({
  params,
}: AdminQuestionEditPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { questionId } = await params;

  const question = await getQuestionByIdDb(questionId);

  if (!question) {
    return <main>Question not found.</main>;
  }

  const [questionSet, options, acceptedAnswers] = await Promise.all([
    getQuestionSetByIdDb(question.question_set_id),
    getQuestionOptionsByQuestionIdDb(question.id),
    getAcceptedAnswersByQuestionIdDb(question.id),
  ]);

  const metadata = (question.metadata ?? {}) as Record<string, unknown>;

  const optionsText = options.map((option) => option.option_text).join("\n");
  const correctOptionIndex =
    options.findIndex((option) => option.is_correct) >= 0
      ? String(options.findIndex((option) => option.is_correct) + 1)
      : "";

  const acceptedAnswersText = acceptedAnswers
    .map((answer) => answer.answer_text)
    .join("\n");

  return (
    <main>
      <div className="mb-6">
        <Link
          href={
            questionSet
              ? `/admin/question-sets/${questionSet.id}`
              : "/admin/question-sets"
          }
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Back to question set
        </Link>
      </div>

      <PageHeader
        title={`Edit Question ${question.position}`}
        description={question.prompt}
      />

      <form action={updateQuestionAction} className="space-y-6">
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={question.question_set_id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Question type</label>
            <select
              name="questionType"
              required
              className="w-full rounded border px-3 py-2"
              defaultValue={question.question_type}
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="translation">Translation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Answer strategy</label>
            <select
              name="answerStrategy"
              className="w-full rounded border px-3 py-2"
              defaultValue={asString(metadata.answerStrategy) || "text_input"}
            >
              <option value="text_input">Text input</option>
              <option value="selection_based">Selection based</option>
              <option value="sentence_builder">Sentence builder</option>
              <option value="upload_required">Upload required</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Prompt</label>
          <textarea
            name="prompt"
            required
            className="w-full rounded border px-3 py-2"
            rows={3}
            defaultValue={question.prompt}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Explanation</label>
          <textarea
            name="explanation"
            className="w-full rounded border px-3 py-2"
            rows={3}
            defaultValue={question.explanation ?? ""}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Marks</label>
            <input
              name="marks"
              type="number"
              min="1"
              defaultValue={String(question.marks)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Position</label>
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={String(question.position)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Audio path</label>
            <input
              name="audioPath"
              className="w-full rounded border px-3 py-2"
              defaultValue={question.audio_path ?? ""}
            />
          </div>
        </div>

        <DashboardCard title="Question State">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={question.is_active}
            />
            Active
          </label>
        </DashboardCard>

        <DashboardCard title="Translation / Text Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">
                Translation direction
              </label>
              <select
                name="translationDirection"
                className="w-full rounded border px-3 py-2"
                defaultValue={asString(metadata.direction)}
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
                defaultValue={asString(metadata.placeholder)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Source language label
              </label>
              <input
                name="sourceLanguageLabel"
                className="w-full rounded border px-3 py-2"
                defaultValue={asString(metadata.sourceLanguageLabel)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Target language label
              </label>
              <input
                name="targetLanguageLabel"
                className="w-full rounded border px-3 py-2"
                defaultValue={asString(metadata.targetLanguageLabel)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Instruction</label>
            <input
              name="instruction"
              className="w-full rounded border px-3 py-2"
              defaultValue={asString(metadata.instruction)}
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
                defaultValue={asString(metadata.selectionDisplayMode) || "grouped"}
              >
                <option value="grouped">Grouped</option>
                <option value="inline_gaps">Inline gaps</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Selection groups</label>
            <textarea
              name="selectionGroupsText"
              className="w-full rounded border px-3 py-2 font-mono text-sm"
              rows={8}
              defaultValue={stringifySelectionGroups(metadata.selectionGroups)}
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Sentence Builder Settings">
          <div>
            <label className="block text-sm font-medium">Word bank</label>
            <textarea
              name="wordBankText"
              className="w-full rounded border px-3 py-2"
              rows={5}
              defaultValue={asStringArray(metadata.wordBank).join("\n")}
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Validation Options">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ignorePunctuation"
                value="true"
                defaultChecked={asBoolean(metadata.ignorePunctuation)}
              />
              Ignore punctuation
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ignoreArticles"
                value="true"
                defaultChecked={asBoolean(metadata.ignoreArticles)}
              />
              Ignore articles
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="collapseWhitespace"
                value="true"
                defaultChecked={asBoolean(metadata.collapseWhitespace, true)}
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
                defaultValue={asNumber(metadata.maxPlays)}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="listeningMode"
                value="true"
                defaultChecked={asBoolean(metadata.listeningMode)}
              />
              Listening mode
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="autoPlay"
                value="true"
                defaultChecked={asBoolean(metadata.autoPlay)}
              />
              Auto play
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="hideNativeControls"
                value="true"
                defaultChecked={asBoolean(metadata.hideNativeControls)}
              />
              Hide native controls
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="requireAudioCompletionBeforeSubmit"
                value="true"
                defaultChecked={asBoolean(metadata.requireAudioCompletionBeforeSubmit)}
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
                defaultValue={optionsText}
              />
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
                defaultValue={correctOptionIndex}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Accepted answers
              </label>
              <textarea
                name="acceptedAnswersText"
                className="w-full rounded border px-3 py-2"
                rows={6}
                defaultValue={acceptedAnswersText}
              />
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
          </div>
        </DashboardCard>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Save question
          </button>
        </div>
      </form>

      <section className="mt-8">
        <DashboardCard title="Danger Zone">
          <form action={deleteQuestionAction}>
            <input type="hidden" name="questionId" value={question.id} />
            <input type="hidden" name="questionSetId" value={question.question_set_id} />
            <button
              type="submit"
              className="rounded-lg border border-red-300 px-4 py-2 text-red-700"
            >
              Delete question
            </button>
          </form>
        </DashboardCard>
      </section>
    </main>
  );
}