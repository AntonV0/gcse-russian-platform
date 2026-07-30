import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";

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
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
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
    </div>
  );
}

export default function AssignmentsLoading() {
  return (
    <main>
      <LearningSheet>
        <LearningSheetHeader eyebrow="Assignments" title="Loading assignments">
          <div className="max-w-3xl space-y-3">
            <LoadingLine className="h-8 w-48" />
            <LoadingLine className="w-full max-w-xl" />
          </div>
        </LearningSheetHeader>

        <LearningSheetSection>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
              >
                <div className="space-y-3">
                  <LoadingLine className="h-10 w-10 rounded-2xl" />
                  <LoadingLine className="h-7 w-20" />
                  <LoadingLine className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </LearningSheetSection>

        <LearningSheetSection>
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <AssignmentLoadingCard key={item} />
            ))}
          </div>
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
