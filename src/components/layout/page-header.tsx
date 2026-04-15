type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 app-header-block">
      <h1 className="app-title">{title}</h1>
      {description ? <p className="app-subtitle">{description}</p> : null}
    </div>
  );
}
