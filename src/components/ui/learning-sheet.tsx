import DevComponentMarker from "@/components/ui/dev-component-marker";

type LearningSheetProps = {
  children: React.ReactNode;
  className?: string;
};

type LearningSheetSectionProps = {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
  muted?: boolean;
};

type LearningSheetHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LearningSheet({ children, className }: LearningSheetProps) {
  return (
    <section
      className={["dev-marker-host relative min-w-0", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LearningSheet"
          filePath="src/components/ui/learning-sheet.tsx"
          tier="container"
          componentRole="Unified student-facing page surface"
          bestFor="Student app pages that should feel like one guided learning workspace beside the platform sidebar."
          usageExamples={[
            "Guest home page",
            "Student dashboard overview",
            "Course overview workspace",
            "Exam resource landing page",
          ]}
          notes="Use as the main page surface beside the sidebar. Prefer internal sections and dividers inside the sheet; reserve separate cards for repeated items or true sub-panels."
        />
      ) : null}

      <div
        className={[
          "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)]",
          "bg-[color-mix(in_srgb,var(--background-elevated)_98%,var(--background))]",
          "shadow-[0_14px_34px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}

export function LearningSheetSection({
  children,
  className,
  divided = true,
  muted = false,
}: LearningSheetSectionProps) {
  return (
    <div
      className={[
        divided ? "border-t border-[var(--border-subtle)]" : "",
        muted
          ? "bg-[color-mix(in_srgb,var(--accent)_3.5%,var(--background-muted))]"
          : "",
        "px-5 py-5 md:px-6 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function LearningSheetHeader({
  eyebrow,
  title,
  description,
  badges,
  actions,
  children,
  className,
}: LearningSheetHeaderProps) {
  return (
    <LearningSheetSection divided={false} className={className}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="app-text-caption uppercase tracking-[0.12em]">{eyebrow}</div>
          ) : null}

          <h1 className="mt-2 max-w-3xl text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[2.75rem]">
            {title}
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl app-text-lede">{description}</p>
          ) : null}

          {badges ? <div className="mt-5 flex flex-wrap gap-2">{badges}</div> : null}
        </div>

        {actions ? (
          <div className="app-mobile-action-stack flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </LearningSheetSection>
  );
}
