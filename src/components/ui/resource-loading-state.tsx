type ResourceLoadingStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  searchFields?: number;
  resultRows?: number;
};

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

function LoadingResourceRow() {
  return (
    <div className="app-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <LoadingBlock className="h-4 w-2/3 max-w-sm" />
          <LoadingBlock className="h-3 w-full max-w-lg" />
          <div className="flex flex-wrap gap-2">
            <LoadingBlock className="h-7 w-20 rounded-full" />
            <LoadingBlock className="h-7 w-24 rounded-full" />
            <LoadingBlock className="h-7 w-16 rounded-full" />
          </div>
        </div>
        <LoadingBlock className="h-10 w-full sm:w-28" />
      </div>
    </div>
  );
}

export default function ResourceLoadingState({
  eyebrow,
  title,
  description,
  searchFields = 3,
  resultRows = 3,
}: ResourceLoadingStateProps) {
  return (
    <main className="space-y-4" aria-busy="true" aria-live="polite">
      <section className="app-intro-panel app-intro-panel-student px-5 py-5 md:px-6 md:py-6">
        <div className="max-w-3xl">
          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] app-text-soft">
            {eyebrow}
          </div>
          <h1 className="mt-2.5 app-title">{title}</h1>
          <p className="mt-3 max-w-2xl app-text-lede">{description}</p>
        </div>
      </section>

      <section className="app-section-card rounded-2xl p-5">
        <div className="mb-4 space-y-2">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Loading finder
          </p>
          <p className="text-sm app-text-muted">
            Getting the filters and latest resources ready.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: searchFields }).map((_, index) => (
            <LoadingBlock key={index} className="h-11" />
          ))}
          <LoadingBlock className="h-11 md:col-span-2 xl:col-span-4 xl:ml-auto xl:w-28" />
        </div>
      </section>

      <section className="app-section-card rounded-2xl p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <LoadingBlock className="h-5 w-36" />
          <LoadingBlock className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid gap-3">
          {Array.from({ length: resultRows }).map((_, index) => (
            <LoadingResourceRow key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
