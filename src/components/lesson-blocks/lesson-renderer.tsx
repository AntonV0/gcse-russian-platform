import TextBlock from "@/components/lesson-blocks/text-block";
import NoteBlock from "@/components/lesson-blocks/note-block";
import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import VocabularySetBlock from "@/components/lesson-blocks/vocabulary-set-block";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import {
  AudioBlock,
  CalloutBlock,
  DividerBlock,
  ExamTipBlock,
  HeaderBlock,
  ImageBlock,
  SubheaderBlock,
} from "@/components/lesson-blocks/structure-blocks";
import MultipleChoiceBlock from "@/components/questions/multiple-choice-block";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { LessonSection } from "@/types/lesson";
import {
  filterVisibleLessonSections,
  isSectionVisible,
  type LessonRendererVariant,
} from "@/lib/lessons/variant-visibility";

export { isSectionVisible, type LessonRendererVariant };

type LessonRendererProps = {
  sections: LessonSection[];
  lessonId?: string | null;
  currentVariant?: LessonRendererVariant;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LessonRenderer({
  sections,
  lessonId = null,
  currentVariant = "foundation",
}: LessonRendererProps) {
  const visibleSections = filterVisibleLessonSections(sections, currentVariant);

  return (
    <div className="dev-marker-host relative space-y-8">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonRenderer"
          filePath="src/components/lesson-blocks/lesson-renderer.tsx"
          tier="container"
          componentRole="Runtime lesson content renderer that filters sections by variant and renders lesson blocks"
          bestFor="Student lesson pages where DB-driven sections and blocks need to render for Foundation, Higher, or Volna variants."
          usageExamples={[
            "Foundation lesson content",
            "Higher lesson content",
            "Volna lesson sections",
            "Vocabulary/grammar/past paper areas",
          ]}
          notes="Use for rendering saved lesson content. Do not use it for admin authoring previews that need edit controls."
        />
      ) : null}

      {visibleSections.map((section) => (
        <section
          key={section.id}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/60 p-4 md:p-6"
        >
          <div className="space-y-2">
            <div className="app-text-meta">
              {section.sectionKind.replaceAll("_", " ")}
            </div>

            <h2 className="app-heading-section">{section.title}</h2>

            {section.description ? (
              <p className="app-text-body-muted">{section.description}</p>
            ) : null}
          </div>

          <div className="space-y-5">
            {section.blocks.map((block, index) => {
              switch (block.type) {
                case "header":
                  return <HeaderBlock key={index} content={block.content} />;

                case "subheader":
                  return <SubheaderBlock key={index} content={block.content} />;

                case "divider":
                  return <DividerBlock key={index} />;

                case "text":
                  return <TextBlock key={index} content={block.content} />;

                case "note":
                  return (
                    <NoteBlock key={index} title={block.title} content={block.content} />
                  );

                case "callout":
                  return (
                    <CalloutBlock
                      key={index}
                      title={block.title}
                      content={block.content}
                    />
                  );

                case "exam-tip":
                  return (
                    <ExamTipBlock
                      key={index}
                      title={block.title}
                      content={block.content}
                    />
                  );

                case "image":
                  return (
                    <ImageBlock
                      key={index}
                      src={block.src}
                      alt={block.alt}
                      caption={block.caption}
                    />
                  );

                case "audio":
                  return (
                    <AudioBlock
                      key={index}
                      title={block.title}
                      src={block.src}
                      caption={block.caption}
                      autoPlay={block.autoPlay}
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
                      vocabularyListSlug={block.vocabularyListSlug}
                      currentVariant={currentVariant}
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
