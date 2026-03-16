export default function DashboardPage() {
  return (
    <main>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          This will become the student dashboard for progress, lessons, and
          revision.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Current course</h2>
          <p className="text-sm text-gray-600">GCSE Russian</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Progress</h2>
          <p className="text-sm text-gray-600">No lessons completed yet.</p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Next step</h2>
          <p className="text-sm text-gray-600">
            Build the first course and lesson structure.
          </p>
        </div>
      </section>
    </main>
  );
}