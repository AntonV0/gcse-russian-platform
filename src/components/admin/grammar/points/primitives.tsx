import type { ReactNode } from "react";

export function GrammarPointAdminStatTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "neutral" | "warning" | "success";
}) {
  const toneClass =
    tone === "warning"
      ? "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]"
      : tone === "success"
        ? "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]"
        : "border-[var(--border-subtle)] bg-[var(--background-elevated)] text-[var(--text-primary)]";

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3 shadow-[var(--shadow-xs)]",
        toneClass,
      ].join(" ")}
    >
      <div className="app-text-meta">{label}</div>
      <div className="mt-1.5 font-semibold app-text-detail">{value}</div>
    </div>
  );
}

export function GrammarPointsEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 app-text-body-muted">
      {children}
    </div>
  );
}
