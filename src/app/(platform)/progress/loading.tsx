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

function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <DashboardCard>
      <div className="space-y-3">
        <LoadingLine className="h-10 w-10 rounded-2xl" />
        {Array.from({ length: lines }).map((_, index) => (
          <LoadingLine
            key={index}
            className={index === 0 ? "w-2/3" : index === 1 ? "w-full" : "w-4/5"}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

export default function ProgressLoading() {
  return (
    <main className="space-y-8">
      <section className="app-intro-panel app-intro-panel-student px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <LoadingLine className="w-28" />
            <LoadingLine className="h-9 w-full max-w-xl rounded-2xl" />
            <LoadingLine className="w-full max-w-2xl" />
            <LoadingLine className="w-2/3 max-w-lg" />
          </div>
          <div className="flex gap-3">
            <LoadingLine className="h-10 w-36 rounded-xl" />
            <LoadingLine className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <LoadingLine className="w-44" />
          <LoadingLine className="h-3 w-full" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <LoadingCard key={item} lines={2} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <LoadingCard key={item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <LoadingCard lines={4} />
        <LoadingCard lines={4} />
      </section>
    </main>
  );
}
