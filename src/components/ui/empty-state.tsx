type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={["rounded-xl border border-dashed px-4 py-8 text-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="font-medium text-gray-900">{title}</div>

      {description ? <p className="mt-2 text-sm text-gray-600">{description}</p> : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
