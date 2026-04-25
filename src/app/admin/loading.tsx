import PanelCard from "@/components/ui/panel-card";

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

export default function AdminLoading() {
  return (
    <main className="space-y-4">
      <section className="app-intro-panel app-intro-panel-admin px-5 py-5 md:px-6 md:py-6">
        <div className="max-w-3xl space-y-4">
          <LoadingLine className="w-36" />
          <LoadingLine className="h-8 w-2/3" />
          <LoadingLine className="w-full max-w-xl" />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <PanelCard key={item} title=" ">
            <div className="space-y-3">
              <LoadingLine className="w-1/2" />
              <LoadingLine />
              <LoadingLine className="w-3/4" />
            </div>
          </PanelCard>
        ))}
      </section>
    </main>
  );
}
