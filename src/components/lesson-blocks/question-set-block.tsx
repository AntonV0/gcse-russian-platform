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
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Question set not found: {questionSetSlug}
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}

      {questionSet.instructions ? (
        <p className="text-sm text-gray-600">{questionSet.instructions}</p>
      ) : null}

      {questions.map((question) => (
        <QuestionRenderer key={question.id} question={question} lessonId={lessonId} />
      ))}
    </section>
  );
}
