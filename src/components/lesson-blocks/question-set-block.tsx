import { loadRuntimeQuestionSetBySlugDb } from "@/lib/questions/question-helpers-db";
import QuestionRenderer from "@/components/questions/question-renderer";

type QuestionSetBlockProps = {
  title?: string;
  questionSetSlug: string;
  lessonId?: string | null;
};

export default async function QuestionSetBlock({
  title,
  questionSetSlug,
  lessonId = null,
}: QuestionSetBlockProps) {
  const { questionSet, questions } =
    await loadRuntimeQuestionSetBySlugDb(questionSetSlug);

  if (!questionSet) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Question set not found: {questionSetSlug}
      </div>
    );
  }

  return (
    <section className="app-card app-section-padding space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="app-pill app-pill-info">Question set</span>
          <span className="app-pill app-pill-muted">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </span>
        </div>

        {title ? (
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
        ) : null}

        {questionSet.instructions ? (
          <p className="text-sm app-text-muted">{questionSet.instructions}</p>
        ) : null}
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
              Question {index + 1}
            </div>

            <QuestionRenderer question={question} lessonId={lessonId} />
          </div>
        ))}
      </div>
    </section>
  );
}
