import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type VocabularyItem = {
  russian: string;
  english: string;
};

type VocabularyBlockProps = {
  title: string;
  items: VocabularyItem[];
  eyebrow?: string;
  description?: string;
  meta?: string[];
  headingLevel?: HeadingLevel;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function VocabularyBlock({
  title,
  items,
  eyebrow = "Vocabulary",
  description,
  meta = [],
  headingLevel = 3,
}: VocabularyBlockProps) {
  return (
    <section className="dev-marker-host relative app-card app-section-padding">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="VocabularyBlock"
          filePath="src/components/lesson-blocks/vocabulary-block.tsx"
          tier="semantic"
          componentRole="Lesson vocabulary list block with metadata, item count, and Russian-English rows"
          bestFor="Vocabulary-focused lesson sections, GCSE topic word lists, and reusable vocabulary-set rendering."
          usageExamples={[
            "High-frequency vocabulary lesson",
            "Theme vocabulary list",
            "Vocabulary set block",
            "Student revision vocabulary area",
          ]}
          notes="Use for compact Russian-English item lists. Do not use for editable vocabulary management tables or long grammar prose."
        />
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="app-pill app-pill-muted">{eyebrow}</span>

              {meta.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <Heading level={headingLevel} className="app-heading-subsection">
                {title}
              </Heading>

              {description ? (
                <p className="max-w-3xl app-text-body-muted">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Items
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
              {items.length}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-6 text-sm text-[var(--text-secondary)]">
            No vocabulary items are available in this set yet.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.russian}-${item.english}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-4">
                  <span lang="ru" className="app-vocab-term">
                    {item.russian}
                  </span>
                  <span className="text-[var(--text-secondary)]">{item.english}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
