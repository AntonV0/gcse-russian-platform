import TextBlock from "@/components/lesson-blocks/text-block";
import NoteBlock from "@/components/lesson-blocks/note-block";
import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import VocabularySetBlock from "@/components/lesson-blocks/vocabulary-set-block";
import MultipleChoiceBlock from "@/components/lesson-blocks/multiple-choice-block";
import ShortAnswerBlock from "@/components/lesson-blocks/short-answer-block";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import type { LessonBlock } from "@/types/lesson";

type LessonRendererProps = {
  blocks: LessonBlock[];
};

export default function LessonRenderer({ blocks }: LessonRendererProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={index} content={block.content} />;

          case "note":
            return (
              <NoteBlock
                key={index}
                title={block.title}
                content={block.content}
              />
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
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}