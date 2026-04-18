type VocabularyItem = {
  russian: string;
  english: string;
};

type VocabularyBlockProps = {
  title: string;
  items: VocabularyItem[];
};

export default function VocabularyBlock({ title, items }: VocabularyBlockProps) {
  return (
    <section className="app-card app-section-padding">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="app-pill app-pill-muted">Vocabulary</span>
      </div>

      <h2 className="mb-5 text-xl font-semibold text-[var(--text-primary)]">{title}</h2>

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
    </section>
  );
}
