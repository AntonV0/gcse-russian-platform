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

export default function PlatformLoading() {
  return (
    <main className="space-y-5">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="max-w-3xl space-y-4">
          <LoadingLine className="w-32" />
          <LoadingLine className="h-8 w-3/4" />
          <LoadingLine className="w-full max-w-xl" />
          <LoadingLine className="w-2/3 max-w-lg" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <DashboardCard key={item}>
            <div className="space-y-3">
              <LoadingLine className="w-1/2" />
              <LoadingLine />
              <LoadingLine className="w-3/4" />
            </div>
          </DashboardCard>
        ))}
      </section>
    </main>
  );
}
