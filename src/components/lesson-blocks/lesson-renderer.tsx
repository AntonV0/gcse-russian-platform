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
import type { LessonSection } from "@/types/lesson";

export type LessonRendererVariant = "foundation" | "higher" | "volna";

type LessonRendererProps = {
  sections: LessonSection[];
  lessonId?: string | null;
  currentVariant?: LessonRendererVariant;
};

function isSectionVisible(section: LessonSection, currentVariant: LessonRendererVariant) {
  if (section.variantVisibility === "shared") {
    return true;
  }

  if (
    section.variantVisibility === "foundation_only" &&
    currentVariant === "foundation"
  ) {
    return true;
  }

  if (section.variantVisibility === "higher_only" && currentVariant === "higher") {
    return true;
  }

  if (section.variantVisibility === "volna_only" && currentVariant === "volna") {
    return true;
  }

  return false;
}

export default function LessonRenderer({
  sections,
  lessonId = null,
  currentVariant = "foundation",
}: LessonRendererProps) {
  const visibleSections = sections.filter((section) =>
    isSectionVisible(section, currentVariant)
  );

  return (
    <div className="space-y-8">
      {visibleSections.map((section) => (
        <section
          key={section.id}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/60 p-4 md:p-6"
        >
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
              {section.sectionKind.replaceAll("_", " ")}
            </div>

            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              {section.title}
            </h2>

            {section.description ? (
              <p className="text-sm app-text-muted">{section.description}</p>
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
