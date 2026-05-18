import DashboardCard from "@/components/ui/dashboard-card";

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

function AssignmentLoadingCard() {
  return (
    <DashboardCard>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <LoadingLine className="h-7 w-24" />
          <LoadingLine className="h-7 w-28" />
        </div>
        <LoadingLine className="h-5 w-full max-w-lg" />
        <LoadingLine className="w-full max-w-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <LoadingLine className="h-16 w-full rounded-2xl" />
          <LoadingLine className="h-16 w-full rounded-2xl" />
          <LoadingLine className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </DashboardCard>
  );
}

export default function AssignmentsLoading() {
  return (
    <main className="space-y-6">
      <section className="space-y-4">
        <div className="max-w-3xl space-y-3">
          <LoadingLine className="h-8 w-48" />
          <LoadingLine className="w-full max-w-xl" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <DashboardCard key={item}>
              <div className="space-y-3">
                <LoadingLine className="h-10 w-10 rounded-2xl" />
                <LoadingLine className="h-7 w-20" />
                <LoadingLine className="w-full" />
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {[0, 1, 2].map((item) => (
          <AssignmentLoadingCard key={item} />
        ))}
      </section>
    </main>
  );
}
