import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";

export default function CoursesLoading() {
  return (
    <main aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading course journey</p>
      <LearningSheet>
        <LearningSheetHeader title="Loading course journey">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-8 w-28 rounded-full bg-[var(--background-muted)]" />
              <div className="h-8 w-24 rounded-full bg-[var(--background-muted)]" />
            </div>
            <div className="h-11 max-w-2xl rounded-2xl bg-[var(--background-muted)]" />
            <div className="h-5 max-w-3xl rounded-xl bg-[var(--background-muted)]" />
            <div className="flex gap-3">
              <div className="h-11 w-36 rounded-xl bg-[var(--background-muted)]" />
              <div className="h-11 w-32 rounded-xl bg-[var(--background-muted)]" />
            </div>
          </div>
        </LearningSheetHeader>

        <LearningSheetSection>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-28 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
            <div className="h-28 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
            <div className="h-28 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
            <div className="h-28 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
          </div>
        </LearningSheetSection>

        <LearningSheetSection>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
            <div className="h-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
            <div className="h-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]" />
          </div>
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
