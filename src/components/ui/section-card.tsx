type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function SectionCard({ title, description, children }: Props) {
  return (
    <section className="app-card">
      <div className="app-card-header">
        <h2 className="app-card-title">{title}</h2>
        {description && <p className="app-card-desc">{description}</p>}
      </div>

      <div className="app-card-body">{children}</div>
    </section>
  );
}
