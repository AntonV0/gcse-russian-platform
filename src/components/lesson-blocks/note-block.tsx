import DevComponentMarker from "@/components/ui/dev-component-marker";

type NoteBlockProps = {
  title: string;
  content: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function NoteBlock({ title, content }: NoteBlockProps) {
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

      <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">{title}</h2>

      <p className="whitespace-pre-wrap leading-7 text-[var(--text-secondary)]">
        {content}
      </p>
    </section>
  );
}
