type TextBlockProps = {
  content: string;
};

export default function TextBlock({ content }: TextBlockProps) {
  return (
    <section className="app-card app-section-padding">
      <div className="prose prose-neutral max-w-none">
        <p className="whitespace-pre-wrap leading-7 text-[var(--text-secondary)]">
          {content}
        </p>
      </div>
    </section>
  );
}
