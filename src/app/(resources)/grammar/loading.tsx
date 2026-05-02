export default function GrammarLoading() {
  return (
    <main className="space-y-4">
      <section className="app-intro-panel app-intro-panel-student px-5 py-5 md:px-6 md:py-6">
        <div className="h-4 w-24 rounded-full bg-[var(--background-muted)]" />
        <div className="mt-4 h-9 max-w-sm rounded-2xl bg-[var(--background-muted)]" />
        <div className="mt-3 h-5 max-w-2xl rounded-xl bg-[var(--background-muted)]" />
      </section>
      <section className="app-section-card rounded-2xl p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_190px_220px_max-content]">
          <div className="h-11 rounded-xl bg-[var(--background-muted)]" />
          <div className="h-11 rounded-xl bg-[var(--background-muted)]" />
          <div className="h-11 rounded-xl bg-[var(--background-muted)]" />
          <div className="h-11 w-28 rounded-xl bg-[var(--background-muted)]" />
        </div>
      </section>
      <section className="grid gap-3">
        <div className="app-card h-28" />
        <div className="app-card h-28" />
        <div className="app-card h-28" />
      </section>
    </main>
  );
}
