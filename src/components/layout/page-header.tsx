type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="app-header-block mb-8 space-y-2">
      <h1 className="app-title">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}
