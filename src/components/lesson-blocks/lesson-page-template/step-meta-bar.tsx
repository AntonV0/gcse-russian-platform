type StepMetaBarProps = {
  currentStepNumber: number;
  totalSteps: number;
  sectionKind: string;
  sectionDescription?: string;
  visitedPercent: number;
};

export function StepMetaBar({
  currentStepNumber,
  totalSteps,
  sectionKind,
  sectionDescription,
  visitedPercent,
}: StepMetaBarProps) {
  return (
    <div className="app-card app-section-padding">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
              Step {currentStepNumber} of {totalSteps} Â·{" "}
              {sectionKind.replaceAll("_", " ")}
            </div>

            {sectionDescription ? (
              <p className="mt-1 text-sm app-text-muted">{sectionDescription}</p>
            ) : null}
          </div>

          <div className="text-sm app-text-muted">
            Visited progress: {visitedPercent}%
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]">
          <div
            className="h-full rounded-full bg-[var(--brand-blue)] transition-all"
            style={{ width: `${visitedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
