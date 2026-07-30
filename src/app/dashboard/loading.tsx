function LoadingLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "h-3 animate-pulse rounded-full bg-[var(--background-muted)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function LoadingPanel({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="space-y-3">
        <LoadingLine className="h-5 w-1/2" />
        <LoadingLine />
        <LoadingLine className="w-3/4" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main aria-label="Loading dashboard" aria-busy="true" aria-live="polite">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[color-mix(in_srgb,var(--background-elevated)_99%,var(--background))] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
        <div className="px-4 py-4 md:px-5 md:py-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
            <div className="min-w-0 space-y-3">
              <LoadingLine className="h-3 w-36" />
              <LoadingLine className="h-9 max-w-xl" />
              <LoadingLine className="h-4 max-w-2xl" />
              <div className="flex flex-wrap gap-2 pt-1">
                <LoadingLine className="h-7 w-24 rounded-full" />
                <LoadingLine className="h-7 w-32 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
              <LoadingLine className="h-10 w-full rounded-xl sm:w-36" />
              <LoadingLine className="h-10 w-full rounded-xl sm:w-36" />
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] px-4 py-4 md:px-5 md:py-5">
          <div className="grid gap-3 md:grid-cols-3">
            <LoadingPanel />
            <LoadingPanel />
            <LoadingPanel />
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_72%,var(--background-elevated))] px-4 py-4 md:px-5 md:py-5">
          <div className="grid gap-3 xl:grid-cols-2">
            <LoadingPanel className="min-h-40" />
            <LoadingPanel className="min-h-40" />
          </div>
        </div>
      </section>
    </main>
  );
}
