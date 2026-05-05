function getUsageToneClass(count: number) {
  if (count === 0) {
    return "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]";
  }

  if (count === 1) {
    return "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]";
  }

  return "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]";
}

export default function GrammarUsageCount({
  label,
  count,
  title,
}: {
  label: string;
  count: number;
  title: string;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-2 rounded-lg border px-2 py-1",
        getUsageToneClass(count),
      ].join(" ")}
      title={title}
    >
      <span className="whitespace-nowrap text-[0.72rem] font-semibold">{label}</span>
      <span className="font-semibold">{count}</span>
    </div>
  );
}
