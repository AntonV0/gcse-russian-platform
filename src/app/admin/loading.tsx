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

export default function AdminLoading() {
  return (
    <main className="space-y-4" aria-busy="true" aria-live="polite">
      <section className="app-intro-panel app-intro-panel-admin px-5 py-5 md:px-6 md:py-6">
        <div className="max-w-3xl space-y-4">
          <div>
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Admin
            </div>
            <h1 className="mt-2.5 app-title">Loading admin area</h1>
            <p className="mt-3 max-w-2xl app-text-lede">
              Preparing tools, filters, and the latest course data.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" aria-hidden="true">
            <LoadingLine className="h-8 w-28 rounded-full" />
            <LoadingLine className="h-8 w-32 rounded-full" />
            <LoadingLine className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </section>

      <section
        className="grid gap-4 lg:grid-cols-2"
        aria-label="Loading admin page sections"
      >
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="app-section-card rounded-2xl p-5">
            <div className="space-y-3">
              <LoadingLine className="h-5 w-1/2" />
              <LoadingLine />
              <LoadingLine className="w-3/4" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
