type NoteBlockProps = {
  title: string;
  content: string;
};

export default function NoteBlock({ title, content }: NoteBlockProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-6 shadow-sm">
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
