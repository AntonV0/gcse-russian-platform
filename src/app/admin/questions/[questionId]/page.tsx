import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getAcceptedAnswersByQuestionIdDb,
  getQuestionByIdDb,
  getQuestionOptionsByQuestionIdDb,
  getQuestionSetByIdDb,
} from "@/lib/questions/question-helpers-db";
import {
  deleteQuestionAction,
  duplicateQuestionAction,
  updateQuestionAction,
} from "@/app/actions/admin/admin-question-actions";
import AdminQuestionForm from "@/components/admin/admin-question-form";

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
      <PageHeader
        title={`Edit Question ${question.position}`}
        description={question.prompt}
      />
      <InlineActions className="mb-6">
        <Button
          href={
            questionSet
              ? `/admin/question-sets/${questionSet.id}`
              : "/admin/question-sets"
          }
          variant="secondary"
          icon="back"
        >
          Back to question set
        </Button>

        {questionSet?.slug ? (
          <Button
            href={`/question-sets/${questionSet.slug}`}
            variant="secondary"
            icon="preview"
          >
            Open public question set
          </Button>
        ) : null}
      </InlineActions>

      <AdminQuestionForm
        mode="edit"
        action={updateQuestionAction}
        questionSetId={question.question_set_id}
        questionId={question.id}
        defaultValues={{
          questionType: question.question_type as
            | "multiple_choice"
            | "short_answer"
            | "translation",
          answerStrategy:
            (asString(metadata.answerStrategy) as
              | "text_input"
              | "selection_based"
              | "sentence_builder"
              | "upload_required") || "text_input",
          prompt: question.prompt,
          explanation: question.explanation ?? "",
          marks: String(question.marks),
          position: String(question.position),
          audioPath: question.audio_path ?? "",
          isActive: question.is_active,
          translationDirection:
            (asString(metadata.direction) as "" | "to_russian" | "to_english") || "",
          placeholder: asString(metadata.placeholder),
          sourceLanguageLabel: asString(metadata.sourceLanguageLabel),
          targetLanguageLabel: asString(metadata.targetLanguageLabel),
          instruction: asString(metadata.instruction),
          selectionDisplayMode:
            (asString(metadata.selectionDisplayMode) as "grouped" | "inline_gaps") ||
            "grouped",
          selectionGroupsText: stringifySelectionGroups(metadata.selectionGroups),
          wordBankText: asStringArray(metadata.wordBank).join("\n"),
          ignorePunctuation: asBoolean(metadata.ignorePunctuation),
          ignoreArticles: asBoolean(metadata.ignoreArticles),
          collapseWhitespace: asBoolean(metadata.collapseWhitespace, true),
          maxPlays: asNumber(metadata.maxPlays),
          listeningMode: asBoolean(metadata.listeningMode),
          autoPlay: asBoolean(metadata.autoPlay),
          hideNativeControls: asBoolean(metadata.hideNativeControls),
          requireAudioCompletionBeforeSubmit: asBoolean(
            metadata.requireAudioCompletionBeforeSubmit
          ),
          optionsText,
          correctOptionIndex,
          acceptedAnswersText,
          metadata: "{}",
        }}
        submitLabel="Save question"
      />

      <section className="mt-8">
        <PanelCard title="Quick Actions" tone="admin">
          <form action={duplicateQuestionAction}>
            <input type="hidden" name="questionId" value={question.id} />
            <input type="hidden" name="questionSetId" value={question.question_set_id} />
            <Button type="submit" variant="secondary" icon="create">
              Duplicate question
            </Button>
          </form>
        </PanelCard>
      </section>

      <section className="mt-8">
        <PanelCard
          title="Danger Zone"
          description="Deleting a question removes it from this question set."
          tone="muted"
        >
          <form action={deleteQuestionAction}>
            <input type="hidden" name="questionId" value={question.id} />
            <input type="hidden" name="questionSetId" value={question.question_set_id} />
            <Button type="submit" variant="danger" icon="delete">
              Delete question
            </Button>
          </form>
        </PanelCard>
      </section>
    </main>
  );
}
