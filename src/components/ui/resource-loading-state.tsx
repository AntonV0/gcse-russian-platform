import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";

type ResourceLoadingStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  searchFields?: number;
  resultRows?: number;
};

function LoadingBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={["app-loading-skeleton", className].filter(Boolean).join(" ")}
    />
  );
}

function LoadingResourceRow() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <LoadingBlock className="h-4 w-2/3 max-w-sm" />
          <LoadingBlock className="h-3 w-full max-w-lg" />
          <div className="flex flex-wrap gap-2">
            <LoadingBlock className="h-7 w-20 rounded-full" />
            <LoadingBlock className="h-7 w-24 rounded-full" />
            <LoadingBlock className="h-7 w-16 rounded-full" />
          </div>
        </div>
        <LoadingBlock className="h-10 w-full sm:w-28" />
      </div>
    </div>
  );
}

export default function ResourceLoadingState({
  eyebrow,
  title,
  description,
  searchFields = 3,
  resultRows = 3,
}: ResourceLoadingStateProps) {
  return (
    <main aria-busy="true" aria-live="polite">
      <LearningSheet>
        <LearningSheetHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <LearningSheetSection>
          <div className="mb-4 space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Loading finder
            </p>
            <p className="text-sm app-text-muted">
              Getting the filters and latest resources ready.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: searchFields }).map((_, index) => (
              <LoadingBlock key={index} className="h-11" />
            ))}
            <LoadingBlock className="h-11 md:col-span-2 xl:col-span-4 xl:ml-auto xl:w-28" />
          </div>
        </LearningSheetSection>

        <LearningSheetSection>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <LoadingBlock className="h-5 w-36" />
            <LoadingBlock className="h-7 w-24 rounded-full" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: resultRows }).map((_, index) => (
              <LoadingResourceRow key={index} />
            ))}
          </div>
        </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
