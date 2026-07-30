import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";

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
    <main aria-busy="true" aria-live="polite">
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Admin"
          title="Loading admin area"
          description="Preparing tools, filters, and the latest course data."
        >
          <div className="flex flex-wrap gap-2" aria-hidden="true">
            <LoadingLine className="h-8 w-28 rounded-full" />
            <LoadingLine className="h-8 w-32 rounded-full" />
            <LoadingLine className="h-8 w-24 rounded-full" />
          </div>
        </OperationsHeader>

        <OperationsSection aria-label="Loading admin page sections">
          <div className="grid gap-3 lg:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
              >
                <div className="space-y-3">
                  <LoadingLine className="h-5 w-1/2" />
                  <LoadingLine />
                  <LoadingLine className="w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
