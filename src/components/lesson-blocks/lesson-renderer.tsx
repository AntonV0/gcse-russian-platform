import TextBlock from "@/components/lesson-blocks/text-block";
import NoteBlock from "@/components/lesson-blocks/note-block";
import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import VocabularySetBlock from "@/components/lesson-blocks/vocabulary-set-block";
import MultipleChoiceBlock from "@/components/questions/multiple-choice-block";
import ShortAnswerBlock from "@/components/questions/short-answer-block";
import QuestionSetBlock from "@/components/lesson-blocks/question-set-block";
import type { LessonSection } from "@/types/lesson";
import Image from "next/image";

type LessonRendererProps = {
  sections: LessonSection[];
  lessonId?: string | null;
};

function HeaderBlock({ content }: { content: string }) {
  return <h3 className="text-3xl font-bold">{content}</h3>;
}

function SubheaderBlock({ content }: { content: string }) {
  return <h4 className="text-xl font-semibold">{content}</h4>;
}

function DividerBlock() {
  return <hr className="my-4 border-gray-300" />;
}

function CalloutBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
      {title ? <div className="mb-1 font-semibold text-blue-900">{title}</div> : null}
      <p className="whitespace-pre-wrap text-blue-900">{content}</p>
    </div>
  );
}

function ExamTipBlock({ title, content }: { title?: string; content: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="mb-1 font-semibold text-amber-900">{title ?? "Exam tip"}</div>
      <p className="whitespace-pre-wrap text-amber-900">{content}</p>
    </div>
  );
}

function ImageBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="space-y-2">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl border bg-white sm:h-[420px] md:h-[500px]">
        <Image
          src={src}
          alt={alt ?? caption ?? "Lesson image"}
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="text-sm text-gray-600">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function AudioBlock({
  title,
  src,
  caption,
  autoPlay,
}: {
  title?: string;
  src: string;
  caption?: string;
  autoPlay?: boolean;
}) {
  return (
    <div className="space-y-2 rounded-xl border bg-white px-4 py-3">
      {title ? <div className="font-medium">{title}</div> : null}
      <audio controls autoPlay={autoPlay} className="w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
      {caption ? <div className="text-sm text-gray-600">{caption}</div> : null}
    </div>
  );
}

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
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {section.sectionKind.replaceAll("_", " ")}
            </div>

            <h2 className="text-2xl font-semibold">{section.title}</h2>

            {section.description ? (
              <p className="text-sm text-gray-600">{section.description}</p>
            ) : null}
          </div>

          <div className="space-y-4">
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
