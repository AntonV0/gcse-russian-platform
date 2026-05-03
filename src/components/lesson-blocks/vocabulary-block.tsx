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
    <section className="dev-marker-host relative overflow-hidden rounded-xl border border-[var(--surface-accent-border)] bg-[var(--surface-raised-bg)] shadow-[var(--shadow-xs)]">
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

      <div className="border-b border-[var(--surface-header-border)] bg-[color-mix(in_srgb,var(--surface-header-bg)_76%,var(--background-elevated))] px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)] shadow-[0_8px_18px_var(--info-shadow)]">
              <AppIcon icon="vocabulary" size={22} />
            </span>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--info-text)]">
                  {eyebrow}
                </span>

                {meta.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="inline-flex max-w-full items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-2 py-0.5 text-[0.72rem] font-semibold text-[var(--text-secondary)]"
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

          <div className="rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-1 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-xs)] md:shrink-0">
            {items.length} phrase{items.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4">
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
