import AppIcon from "@/components/ui/app-icon";
import { Heading, type HeadingLevel } from "@/components/ui/heading";
import type { AppIconKey } from "@/lib/shared/icons";

type StudyBlockTone = "explain" | "coach" | "practice" | "exam" | "media";

type StudyMissionPanelProps = {
  courseTitle: string;
  moduleTitle: string;
  sectionTitle: string;
  sectionDescription?: string | null;
  sectionKind: string;
  currentStepNumber: number;
  totalSteps: number;
  visitedPercent: number;
};

type StudyBlockShellProps = {
  tone?: StudyBlockTone;
  eyebrow: string;
  title?: string;
  description?: string;
  icon?: AppIconKey;
  headingLevel?: HeadingLevel;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const toneIcons: Record<StudyBlockTone, AppIconKey> = {
  explain: "lessonContent",
  coach: "idea",
  practice: "exercise",
  exam: "examTip",
  media: "image",
};

const toneStyles: Record<
  StudyBlockTone,
  {
    shell: string;
    icon: string;
    rule: string;
  }
> = {
  explain: {
    shell: "border-[var(--border)] bg-[var(--background-elevated)]",
    icon:
      "border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--background-muted))] text-[var(--accent-ink)]",
    rule: "bg-[var(--accent-fill)]",
  },
  coach: {
    shell:
      "border-[color-mix(in_srgb,var(--warning)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--warning)_7%,var(--background-elevated))]",
    icon:
      "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
    rule: "bg-[var(--warning)]",
  },
  practice: {
    shell:
      "border-[var(--info-border)] bg-[color-mix(in_srgb,var(--info-surface)_72%,var(--background-elevated))]",
    icon:
      "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]",
    rule: "bg-[var(--accent-fill)]",
  },
  exam: {
    shell:
      "border-[var(--warning-border)] bg-[color-mix(in_srgb,var(--warning-surface)_60%,var(--background-elevated))]",
    icon:
      "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
    rule: "bg-[var(--warning)]",
  },
  media: {
    shell:
      "border-[color-mix(in_srgb,var(--accent)_14%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_4%,var(--background-elevated))]",
    icon:
      "border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-muted))] text-[var(--accent-ink)]",
    rule: "bg-[var(--accent-fill)]",
  },
};

function getSectionKindLabel(sectionKind: string) {
  return sectionKind.replaceAll("_", " ");
}

export function StudyMissionPanel({
  courseTitle,
  moduleTitle,
  sectionTitle,
  sectionDescription,
  sectionKind,
  currentStepNumber,
  totalSteps,
  visitedPercent,
}: StudyMissionPanelProps) {
  const progressValue = Math.min(100, Math.max(0, visitedPercent));
  const progressLabel = `${progressValue}%`;
  const sectionKindLabel = getSectionKindLabel(sectionKind);

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]"
      aria-label={`${courseTitle}: ${moduleTitle}`}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 [background:var(--accent-progress-gradient)]" />

      <div className="relative grid gap-4 p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="app-pill app-pill-info">
              Step {currentStepNumber} of {totalSteps}
            </span>
            <span className="app-pill app-pill-muted capitalize">{sectionKindLabel}</span>
          </div>

          <Heading
            level={2}
            className="max-w-3xl text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl"
          >
            {sectionTitle}
          </Heading>

          {sectionDescription ? (
            <p className="max-w-2xl text-base leading-7 app-text-muted">
              {sectionDescription}
            </p>
          ) : (
            <p className="max-w-2xl text-base leading-7 app-text-muted">
              Work through this section, try the practice, then move on when it feels
              steady.
            </p>
          )}
        </div>

        <div
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/55 p-3 shadow-[var(--shadow-xs)]"
          aria-label="Opened sections"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[var(--background-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon="learning" size={18} />
            </span>
            <div className="min-w-0">
              <div className="app-text-meta">Opened for review</div>
              <div className="mt-1 text-2xl font-bold leading-none text-[var(--text-primary)]">
                {progressLabel}
              </div>
            </div>
          </div>

          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--background-elevated)] shadow-[inset_0_0_0_1px_var(--border-subtle)]"
            role="meter"
            aria-label="Opened sections"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
          >
            <div
              className="h-full rounded-full [background:var(--accent-progress-gradient)]"
              style={{ width: progressLabel }}
            />
          </div>

          <p className="mt-2 text-xs leading-5 app-text-muted">
            Your opened sections stay available in the map.
          </p>
        </div>
      </div>
    </section>
  );
}

export function StudyBlockShell({
  tone = "explain",
  eyebrow,
  title,
  description,
  icon,
  headingLevel = 3,
  actions,
  children,
  className,
  contentClassName,
}: StudyBlockShellProps) {
  const blockIcon = icon ?? toneIcons[tone];
  const styles = toneStyles[tone];

  return (
    <section
      className={[
        "relative overflow-hidden rounded-2xl border shadow-[var(--shadow-xs)]",
        styles.shell,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["absolute inset-x-0 top-0 h-px", styles.rule].join(" ")} />

      <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_24%,transparent)] p-3 md:flex-row md:items-start md:justify-between md:p-4">
        <div className="flex min-w-0 gap-3">
          <span
            className={[
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
              styles.icon,
            ].join(" ")}
          >
            <AppIcon icon={blockIcon} size={19} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] app-text-soft">
              {eyebrow}
            </div>

            {title ? (
              <Heading
                level={headingLevel}
                className="mt-1 text-lg font-bold leading-tight text-[var(--text-primary)] md:text-xl"
              >
                {title}
              </Heading>
            ) : null}

            {description ? (
              <p className="mt-2 text-sm leading-6 app-text-muted">{description}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className={["p-3 md:p-4", contentClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </section>
  );
}
