function LoadingBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--background-muted)_82%,var(--background-elevated))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function LoadingLessonStep() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-2.5">
      <div className="flex items-center gap-2.5">
        <LoadingBlock className="h-8 w-8 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <LoadingBlock className="h-3 w-4/5" />
          <LoadingBlock className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function LessonLoading() {
  return (
    <main className="space-y-4" aria-busy="true" aria-live="polite">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-3">
          <LoadingBlock className="h-4 w-36 rounded-full" />
          <LoadingBlock className="h-8 max-w-2xl" />
          <LoadingBlock className="h-4 max-w-xl" />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="app-lesson-page-surface overflow-hidden">
          <div className="border-b border-[var(--border-subtle)] p-4 md:p-5">
            <LoadingBlock className="h-4 w-28 rounded-full" />
            <LoadingBlock className="mt-3 h-8 max-w-lg" />
            <LoadingBlock className="mt-3 h-4 max-w-2xl" />
            <LoadingBlock className="mt-4 h-1.5 w-full rounded-full" />
          </div>

          <div className="app-lesson-page-article space-y-5 px-4 py-5 md:px-6 md:py-6">
            <LoadingBlock className="h-5 w-3/5" />
            <LoadingBlock className="h-4 w-full" />
            <LoadingBlock className="h-4 w-11/12" />
            <LoadingBlock className="h-36 w-full" />
            <LoadingBlock className="h-48 w-full" />
          </div>

          <div className="app-section-pager-shell px-4 pb-4 md:px-6">
            <div className="rounded-b-xl border border-[var(--border-subtle)] p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <LoadingBlock className="h-3 w-24" />
                  <LoadingBlock className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                  <LoadingBlock className="h-10 w-20" />
                  <LoadingBlock className="h-10 w-20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="order-first xl:order-none">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-2">
            <div className="px-2 py-2">
              <LoadingBlock className="h-3 w-20" />
              <LoadingBlock className="mt-2 h-4 w-16" />
              <LoadingBlock className="mt-3 h-1.5 w-full rounded-full" />
            </div>
            <div className="space-y-1">
              {[0, 1, 2, 3].map((item) => (
                <LoadingLessonStep key={item} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
