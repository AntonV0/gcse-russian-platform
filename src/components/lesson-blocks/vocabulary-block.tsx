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
};

export default function VocabularyBlock({
  title,
  items,
  eyebrow = "Vocabulary",
  description,
  meta = [],
}: VocabularyBlockProps) {
  return (
    <section className="app-card app-section-padding">
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
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {title}
              </h2>

              {description ? (
                <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
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
                  <span className="font-semibold text-[var(--text-primary)]">
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
