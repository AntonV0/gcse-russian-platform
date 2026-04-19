import AppIcon from "@/components/ui/app-icon";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
};

export default function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)]/55 px-5 py-8 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
            <AppIcon icon={icon} size={20} />
          </span>
        </div>
      ) : null}

      <div className="font-semibold text-[var(--text-primary)]">{title}</div>

      {description ? <p className="mt-2 text-sm app-text-muted">{description}</p> : null}

      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
