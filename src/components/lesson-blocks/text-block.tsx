import DevComponentMarker from "@/components/ui/dev-component-marker";

type TextBlockProps = {
  content: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function TextBlock({ content }: TextBlockProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TextBlock"
          filePath="src/components/lesson-blocks/text-block.tsx"
          tier="semantic"
          componentRole="Lesson text content block for prose instruction or explanation"
          bestFor="Student lesson sections that need focused explanatory text, grammar notes, or reading guidance."
          usageExamples={[
            "Grammar explanation",
            "Course introduction text",
            "Past paper strategy note",
            "Vocabulary context paragraph",
          ]}
          notes="Use for prose content only. Do not use for callouts, exam tips, vocabulary tables, or interactive questions."
        />
      ) : null}

      <section className="max-w-3xl px-1">
        <p className="whitespace-pre-wrap text-base leading-8 text-[var(--text-primary)]">
          {content}
        </p>
      </section>
    </div>
  );
}
