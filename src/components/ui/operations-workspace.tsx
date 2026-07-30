import DevComponentMarker from "@/components/ui/dev-component-marker";

type OperationsWorkspaceProps = {
  children: React.ReactNode;
  className?: string;
};

type OperationsHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

type OperationsSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
  muted?: boolean;
};

type OperationsToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function OperationsWorkspace({
  children,
  className,
}: OperationsWorkspaceProps) {
  return (
    <section className={["dev-marker-host relative min-w-0", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="OperationsWorkspace"
          filePath="src/components/ui/operations-workspace.tsx"
          tier="container"
          componentRole="Operational teacher/admin page surface"
          bestFor="Teacher and admin pages that need dense tool layouts, tables, forms, review queues, or management panels."
          usageExamples={[
            "Teacher assignments",
            "Admin content management",
            "Review queues",
            "Operational settings pages",
          ]}
          notes="Use for teacher/admin pages. Prefer compact headers, status bands, toolbars, and dense work areas. Use LearningSheet for student-facing learning pages."
        />
      ) : null}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[color-mix(in_srgb,var(--background-elevated)_99%,var(--background))] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
        {children}
      </div>
    </section>
  );
}

export function OperationsHeader({
  eyebrow,
  title,
  description,
  badges,
  actions,
  children,
  className,
}: OperationsHeaderProps) {
  return (
    <OperationsSection divided={false} className={["py-4 md:py-5", className].filter(Boolean).join(" ")}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="app-text-caption uppercase tracking-[0.12em]">{eyebrow}</div>
          ) : null}
          <h1 className="mt-1 text-[1.75rem] font-extrabold leading-[1.08] text-[var(--text-primary)] [letter-spacing:0] md:text-[2.15rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)] md:text-base">
              {description}
            </p>
          ) : null}
          {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
        </div>
        {actions ? (
          <div className="app-mobile-action-stack flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </OperationsSection>
  );
}

export function OperationsSection({
  children,
  className,
  divided = true,
  muted = false,
  ...props
}: OperationsSectionProps) {
  return (
    <div
      {...props}
      className={[
        divided ? "border-t border-[var(--border-subtle)]" : "",
        muted ? "bg-[color-mix(in_srgb,var(--background-muted)_72%,var(--background-elevated))]" : "",
        "px-4 py-4 md:px-5 md:py-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function OperationsToolbar({ children, className }: OperationsToolbarProps) {
  return (
    <div
      className={[
        "flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-3",
        "sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
