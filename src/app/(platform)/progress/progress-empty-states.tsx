import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import type { StudentDashboardAction } from "@/lib/dashboard/student-next-actions";

export function ProgressUnavailableState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  icon: "courses" | "billing";
}) {
  return (
    <main>
      <EmptyState
        icon={icon}
        iconTone="brand"
        title={title}
        description={description}
        headingLevel={1}
        action={
          <Button href={actionHref} variant="primary" icon={icon}>
            {actionLabel}
          </Button>
        }
      />
    </main>
  );
}

export function ProgressEmptyBlock({
  icon,
  title,
  description,
  action,
}: {
  icon: StudentDashboardAction["icon"];
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="app-empty-dashed-warm rounded-2xl border px-4 py-6 text-center">
      <div className="mb-4 flex justify-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
          <AppIcon icon={icon} size={18} />
        </span>
      </div>
      <div className="app-heading-card">{title}</div>
      <p className="mx-auto mt-2 max-w-[24rem] app-text-body-muted">{description}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}
