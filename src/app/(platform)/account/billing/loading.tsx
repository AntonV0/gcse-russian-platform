export default function BillingLoading() {
  return (
    <main className="space-y-5 py-5 md:py-8">
      <section className="app-surface-brand px-4 py-5 md:px-6 md:py-7">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="mx-auto h-6 w-36 rounded-full bg-[var(--background-muted)]" />
          <div className="mx-auto h-12 max-w-2xl rounded-2xl bg-[var(--background-muted)]" />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="app-card h-24" />
            <div className="app-card h-24" />
            <div className="app-card h-24" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="app-card h-96" />
            <div className="app-card h-96" />
          </div>
        </div>
      </section>
    </main>
  );
}
