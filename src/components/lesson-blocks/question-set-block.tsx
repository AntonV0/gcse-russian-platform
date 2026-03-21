import { loadRuntimeQuestionSetBySlugDb } from "@/lib/question-helpers-db";
import TrackedMultipleChoiceBlock from "@/components/lesson-blocks/tracked-multiple-choice-block";
import TrackedShortAnswerBlock from "@/components/lesson-blocks/tracked-short-answer-block";

type QuestionSetBlockProps = {
  title?: string;
  questionSetSlug: string;
};

export default async function QuestionSetBlock({
  title,
  questionSetSlug,
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

      {questions.map((question) => {
        switch (question.type) {
          case "multiple_choice":
            return (
              <TrackedMultipleChoiceBlock
                key={question.id}
                questionId={question.id}
                question={question.prompt}
                options={question.options.map((option) => ({
                  id: option.id,
                  text: option.text,
                }))}
                correctOptionId={question.correctOptionId ?? ""}
                explanation={question.explanation ?? undefined}
              />
            );

          case "short_answer":
            return (
              <TrackedShortAnswerBlock
                key={question.id}
                questionId={question.id}
                question={question.prompt}
                questionType="short_answer"
                acceptedAnswers={question.acceptedAnswers}
                explanation={question.explanation ?? undefined}
                placeholder={
                  typeof question.metadata.placeholder === "string"
                    ? question.metadata.placeholder
                    : "Type your answer"
                }
              />
            );

          case "translation":
            return (
              <TrackedShortAnswerBlock
                key={question.id}
                questionId={question.id}
                question={question.prompt}
                questionType="translation"
                acceptedAnswers={question.acceptedAnswers}
                explanation={question.explanation ?? undefined}
                placeholder={
                  typeof question.metadata.placeholder === "string"
                    ? question.metadata.placeholder
                    : "Type your translation"
                }
                translationUi={{
                  direction:
                    question.metadata.direction === "to_russian" ||
                    question.metadata.direction === "to_english"
                      ? question.metadata.direction
                      : undefined,
                  sourceLanguageLabel:
                    typeof question.metadata.sourceLanguageLabel === "string"
                      ? question.metadata.sourceLanguageLabel
                      : undefined,
                  targetLanguageLabel:
                    typeof question.metadata.targetLanguageLabel === "string"
                      ? question.metadata.targetLanguageLabel
                      : undefined,
                  instruction:
                    typeof question.metadata.instruction === "string"
                      ? question.metadata.instruction
                      : undefined,
                  placeholder:
                    typeof question.metadata.placeholder === "string"
                      ? question.metadata.placeholder
                      : undefined,
                }}
              />
            );
        }
      })}
    </section>
  );
}