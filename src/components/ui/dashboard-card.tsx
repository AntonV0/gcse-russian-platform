type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <div className={["app-card p-5", className].filter(Boolean).join(" ")}>
      {title ? (
        <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      ) : null}

      <div className="text-sm app-text-muted">{children}</div>
    </div>
  );
}
