import DevComponentMarker from "@/components/ui/dev-component-marker";

type TextBlockProps = {
  content: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function TextBlock({ content }: TextBlockProps) {
  return (
    <section className="dev-marker-host relative app-card app-section-padding">
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

      <div className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap leading-7 text-[var(--text-secondary)]">
          {content}
        </p>
      </div>
    </section>
  );
}
