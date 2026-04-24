import DevComponentMarker from "@/components/ui/dev-component-marker";

type StepMetaBarProps = {
  currentStepNumber: number;
  totalSteps: number;
  sectionKind: string;
  sectionDescription?: string;
  visitedPercent: number;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function StepMetaBar({
  currentStepNumber,
  totalSteps,
  sectionKind,
  sectionDescription,
  visitedPercent,
}: StepMetaBarProps) {
  return (
    <div className="dev-marker-host relative app-card app-section-padding">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="StepMetaBar"
          filePath="src/components/lesson-blocks/lesson-page-template/step-meta-bar.tsx"
          tier="semantic"
          componentRole="Lesson step progress summary with section kind, description, and visited-progress bar"
          bestFor="Student lesson pages where the current section needs lightweight progress context above content."
          usageExamples={[
            "Section-based lesson flow",
            "Student lesson progress",
            "Foundation lesson steps",
            "Volna assigned lesson progress",
          ]}
          notes="Use for section progress context only. Do not use for full lesson completion controls or dashboard metrics."
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
              Step {currentStepNumber} of {totalSteps} -{" "}
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
