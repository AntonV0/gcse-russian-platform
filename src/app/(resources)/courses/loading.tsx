export default function CoursesLoading() {
  return (
    <main className="space-y-8" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading course journey</p>
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-8 w-28 rounded-full bg-[var(--background-muted)]" />
              <div className="h-8 w-24 rounded-full bg-[var(--background-muted)]" />
            </div>
            <div className="h-11 max-w-2xl rounded-2xl bg-[var(--background-muted)]" />
            <div className="h-5 max-w-3xl rounded-xl bg-[var(--background-muted)]" />
            <div className="flex gap-3">
              <div className="h-11 w-36 rounded-xl bg-[var(--background-muted)]" />
              <div className="h-11 w-32 rounded-xl bg-[var(--background-muted)]" />
            </div>
          </div>

          <div className="app-card h-56" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="app-card h-28" />
        <div className="app-card h-28" />
        <div className="app-card h-28" />
        <div className="app-card h-28" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="app-card h-64" />
        <div className="app-card h-64" />
        <div className="app-card h-64" />
      </section>
    </main>
  );
}
