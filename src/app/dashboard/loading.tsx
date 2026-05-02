export default function DashboardLoading() {
  return (
    <main className="space-y-6">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <div className="space-y-4">
            <div className="h-6 w-40 rounded-full bg-[var(--background-muted)]" />
            <div className="h-10 max-w-xl rounded-2xl bg-[var(--background-muted)]" />
            <div className="h-5 max-w-2xl rounded-xl bg-[var(--background-muted)]" />
            <div className="flex gap-3">
              <div className="h-10 w-36 rounded-xl bg-[var(--background-muted)]" />
              <div className="h-10 w-36 rounded-xl bg-[var(--background-muted)]" />
            </div>
          </div>
          <div className="app-card h-64 p-5" />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="app-card h-40" />
        <div className="app-card h-40" />
        <div className="app-card h-40" />
      </section>
    </main>
  );
}
