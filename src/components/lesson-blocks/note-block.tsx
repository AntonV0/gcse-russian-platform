import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type NoteBlockProps = {
  title: string;
  content: string;
  headingLevel?: HeadingLevel;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function NoteBlock({
  title,
  content,
  headingLevel = 3,
}: NoteBlockProps) {
  return (
    <section className="dev-marker-host relative rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-6 shadow-sm">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="NoteBlock"
          filePath="src/components/lesson-blocks/note-block.tsx"
          tier="semantic"
          componentRole="Lesson note block for titled supporting guidance inside a section"
          bestFor="Student lesson content where a short study note needs visual separation from main prose."
          usageExamples={[
            "Grammar reminder",
            "Vocabulary learning tip",
            "Assignment preparation note",
            "Lesson-specific study advice",
          ]}
          notes="Use for supporting notes with a clear title. Do not use for primary lesson text, warning states, or exam-tip styling."
        />
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="app-pill app-pill-info">Note</span>
      </div>

      <Heading level={headingLevel} className="mb-2 app-heading-subsection">
        {title}
      </Heading>

      <p className="app-text-body-muted whitespace-pre-wrap">{content}</p>
    </section>
  );
}
