type UiLabSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function UiLabSection({
  title,
  description,
  children,
}: UiLabSectionProps) {
  return (
    <section className="app-card app-section-padding space-y-4">
      <div>
        <h2 className="app-section-title">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm app-text-muted">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
