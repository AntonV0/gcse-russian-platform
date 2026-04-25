export default function CoursesLoading() {
  return (
    <main className="space-y-6">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-full bg-[var(--background-muted)]" />
          <div className="h-10 max-w-lg rounded-2xl bg-[var(--background-muted)]" />
          <div className="h-5 max-w-2xl rounded-xl bg-[var(--background-muted)]" />
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="app-card h-56" />
        <div className="app-card h-56" />
      </section>
    </main>
  );
}
