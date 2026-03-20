import { loadQuestionSetBySlugDb } from "@/lib/question-helpers-db";
import MultipleChoiceBlock from "@/components/lesson-blocks/multiple-choice-block";
import ShortAnswerBlock from "@/components/lesson-blocks/short-answer-block";

type QuestionSetBlockProps = {
  title?: string;
  questionSetSlug: string;
};

export default async function QuestionSetBlock({
  title,
  questionSetSlug,
}: QuestionSetBlockProps) {
  const { questionSet, questions, options, acceptedAnswers } =
    await loadQuestionSetBySlugDb(questionSetSlug);

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
        const questionOptions = options.filter(
          (option) => option.question_id === question.id
        );

        const questionAcceptedAnswers = acceptedAnswers
          .filter((answer) => answer.question_id === question.id)
          .map((answer) => answer.answer_text);

        switch (question.question_type) {
          case "multiple_choice":
            return (
              <MultipleChoiceBlock
                key={question.id}
                question={question.prompt}
                options={questionOptions.map((option) => ({
                  id: option.id,
                  text: option.option_text ?? "",
                }))}
                correctOptionId={
                  questionOptions.find((option) => option.is_correct)?.id ?? ""
                }
                explanation={question.explanation ?? undefined}
              />
            );

          case "short_answer":
          case "translation":
            return (
              <ShortAnswerBlock
                key={question.id}
                question={question.prompt}
                acceptedAnswers={questionAcceptedAnswers}
                explanation={question.explanation ?? undefined}
                placeholder="Type your answer"
              />
            );

          default:
            return (
              <div
                key={question.id}
                className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700"
              >
                Unsupported question type: {question.question_type}
              </div>
            );
        }
      })}
    </section>
  );
}