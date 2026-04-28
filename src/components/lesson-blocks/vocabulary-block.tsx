import DevComponentMarker from "@/components/ui/dev-component-marker";
import AppIcon from "@/components/ui/app-icon";
import { Heading, type HeadingLevel } from "@/components/ui/heading";
import VocabularyStudyList from "@/components/lesson-blocks/vocabulary-study-list";

type VocabularyItem = {
  russian: string;
  english: string;
  transliteration?: string | null;
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
    <section className="dev-marker-host relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--surface-accent-border)] bg-[var(--surface-raised-bg)] shadow-[var(--surface-panel-shadow)]">
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

      <div className="border-b border-[var(--surface-header-border)] bg-[var(--surface-header-bg)] px-5 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)] shadow-[0_10px_22px_var(--info-shadow)]">
              <AppIcon icon="vocabulary" size={22} />
            </span>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex min-h-[1.9rem] items-center rounded-full border border-[var(--info-border)] bg-[var(--info-surface)] px-3 py-1 text-[0.76rem] font-semibold text-[var(--info-text)]">
                  {eyebrow}
                </span>

                {meta.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="inline-flex min-h-[1.9rem] max-w-full items-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-1 text-[0.76rem] font-semibold text-[var(--text-secondary)]"
                  >
                    <span className="truncate">{item}</span>
                  </span>
                ))}
              </div>

              <div>
                <Heading level={headingLevel} className="app-heading-subsection">
                  {title}
                </Heading>

                {description ? (
                  <p className="mt-2 max-w-3xl app-text-body-muted">{description}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid min-w-[8rem] grid-cols-2 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] text-center shadow-[var(--shadow-xs)] md:shrink-0">
            <div className="border-r border-[var(--border-subtle)] px-3 py-3">
              <div className="app-text-meta">Items</div>
              <div className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                {items.length}
              </div>
            </div>
            <div className="px-3 py-3">
              <div className="app-text-meta">Study</div>
              <div className="mt-1 flex justify-center text-[var(--accent-ink)]">
                <AppIcon icon="brain" size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-6 text-sm text-[var(--text-secondary)]">
            No vocabulary items are available in this set yet.
          </div>
        ) : (
          <VocabularyStudyList items={items} />
        )}
      </div>
    </section>
  );
}
