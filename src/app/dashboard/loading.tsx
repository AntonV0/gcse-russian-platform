export default function DashboardLoading() {
  return (
    <main className="space-y-8" aria-label="Loading dashboard">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-28 rounded-full bg-[var(--background-muted)]" />
              <div className="h-6 w-36 rounded-full bg-[var(--background-muted)]" />
            </div>
            <div className="h-10 max-w-xl rounded-2xl bg-[var(--background-muted)]" />
            <div className="h-5 max-w-2xl rounded-xl bg-[var(--background-muted)]" />
            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              <div className="h-11 w-full rounded-xl bg-[var(--background-muted)] sm:w-36" />
              <div className="h-11 w-full rounded-xl bg-[var(--background-muted)] sm:w-36" />
            </div>
            <div className="grid gap-2 rounded-2xl border border-[var(--surface-accent-border)] bg-[var(--surface-accent-bg)] p-3 sm:grid-cols-3">
              <div className="h-16 rounded-xl bg-[var(--background-elevated)]/80" />
              <div className="h-16 rounded-xl bg-[var(--background-elevated)]/80" />
              <div className="h-16 rounded-xl bg-[var(--background-elevated)]/80" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="app-card h-64 p-5" />
            <div className="app-card h-32 p-5" />
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="app-card h-32" />
        <div className="app-card h-32" />
        <div className="app-card h-32" />
        <div className="app-card h-32" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)]">
        <div className="app-card h-56" />
        <div className="app-card h-56" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.7fr)_minmax(300px,0.8fr)]">
        <div className="app-card h-72" />
        <div className="app-card h-72" />
        <div className="app-card h-72" />
      </section>
    </main>
  );
}
