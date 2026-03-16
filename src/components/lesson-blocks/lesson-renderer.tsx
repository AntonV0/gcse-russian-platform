import TextBlock from "@/components/lesson-blocks/text-block";
import NoteBlock from "@/components/lesson-blocks/note-block";
import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import MultipleChoiceBlock from "@/components/lesson-blocks/multiple-choice-block";
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

          default:
            return null;
        }
      })}
    </div>
  );
}