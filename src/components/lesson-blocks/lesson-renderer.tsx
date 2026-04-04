import TextBlock from "@/components/lesson-blocks/text-block";
import NoteBlock from "@/components/lesson-blocks/note-block";
import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import VocabularySetBlock from "@/components/lesson-blocks/vocabulary-set-block";
import MultipleChoiceBlock from "@/components/questions/multiple-choice-block";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import type { LessonSection } from "@/types/lesson";

type LessonRendererProps = {
  sections: LessonSection[];
  lessonId?: string | null;
};

export default function LessonRenderer({
  sections,
  lessonId = null,
}: LessonRendererProps) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section
          key={section.id}
          className="space-y-4 rounded-2xl border bg-gray-50/50 p-4 md:p-6"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{section.title}</h2>

            {section.description ? (
              <p className="text-sm text-gray-600">{section.description}</p>
            ) : null}
          </div>

          <div className="space-y-4">
            {section.blocks.map((block, index) => {
              switch (block.type) {
                case "text":
                  return <TextBlock key={index} content={block.content} />;

                case "note":
                  return (
                    <NoteBlock key={index} title={block.title} content={block.content} />
                  );

                case "vocabulary":
                  return (
                    <VocabularyBlock
                      key={index}
                      title={block.title}
                      items={block.items}
                    />
                  );

                case "vocabulary-set":
                  return (
                    <VocabularySetBlock
                      key={index}
                      title={block.title}
                      vocabularySetSlug={block.vocabularySetSlug}
                    />
                  );

                case "multiple-choice":
                  return (
                    <MultipleChoiceBlock
                      key={index}
                      question={block.question}
                      options={block.options}
                      correctOptionId={block.correctOptionId}
                      explanation={block.explanation}
                    />
                  );

                case "short-answer":
                  return (
                    <ShortAnswerBlock
                      key={index}
                      question={block.question}
                      acceptedAnswers={block.acceptedAnswers}
                      explanation={block.explanation}
                      placeholder={block.placeholder}
                    />
                  );

                case "question-set":
                  return (
                    <QuestionSetBlock
                      key={index}
                      title={block.title}
                      questionSetSlug={block.questionSetSlug}
                      lessonId={lessonId}
                    />
                  );

                default:
                  return null;
              }
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
