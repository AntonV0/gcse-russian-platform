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

export default function PlatformLoading() {
  return (
    <main>
      <LearningSheet>
        <LearningSheetHeader title="Loading your workspace">
          <div className="max-w-3xl space-y-4">
            <LoadingLine className="w-32" />
            <LoadingLine className="h-8 w-3/4" />
            <LoadingLine className="w-full max-w-xl" />
            <LoadingLine className="w-2/3 max-w-lg" />
          </div>
        </LearningSheetHeader>

        <LearningSheetSection>
          <div className="grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
              >
                <div className="space-y-3">
                  <LoadingLine className="w-1/2" />
                  <LoadingLine />
                  <LoadingLine className="w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
