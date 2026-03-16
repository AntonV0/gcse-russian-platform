type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      {description ? (
        <p className="text-gray-600">{description}</p>
      ) : null}
    </div>
  );
}