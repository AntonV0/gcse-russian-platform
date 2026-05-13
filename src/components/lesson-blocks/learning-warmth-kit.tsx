import AppIcon from "@/components/ui/app-icon";
import { Heading, type HeadingLevel } from "@/components/ui/heading";
import type { AppIconKey } from "@/lib/shared/icons";

type StudyBlockTone = "explain" | "coach" | "practice" | "exam" | "media";

type StudyMissionPanelProps = {
  headingId?: string;
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
    icon: "border-[color-mix(in_srgb,var(--accent-border-ink)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--background-muted))] text-[var(--accent-ink)]",
    rule: "bg-[var(--accent-fill)]",
  },
  coach: {
    shell:
      "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--warning-surface)_24%,var(--background-elevated))]",
    icon: "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
    rule: "bg-[var(--warning)]",
  },
  practice: {
    shell:
      "border-[var(--info-border)] bg-[color-mix(in_srgb,var(--info-surface)_72%,var(--background-elevated))]",
    icon: "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]",
    rule: "bg-[var(--accent-fill)]",
  },
  exam: {
    shell:
      "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--warning-surface)_28%,var(--background-elevated))]",
    icon: "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
    rule: "bg-[var(--warning)]",
  },
  media: {
    shell:
      "border-[color-mix(in_srgb,var(--accent-border-ink)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_4%,var(--background-elevated))]",
    icon: "border-[color-mix(in_srgb,var(--accent-border-ink)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-muted))] text-[var(--accent-ink)]",
    rule: "bg-[var(--accent-fill)]",
  },
};

function getSectionKindLabel(sectionKind: string) {
  return sectionKind.replaceAll("_", " ");
}

export function StudyMissionPanel({
  headingId,
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
      className="relative z-20 overflow-hidden rounded-t-[calc(var(--radius-xl)-1px)] border-b border-[color-mix(in_srgb,var(--accent-border-ink)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_90%,var(--background-muted))]"
      aria-label={`${courseTitle}: ${moduleTitle}`}
    >
      <div className="relative p-4 md:p-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex max-w-full items-center rounded-full border border-[color-mix(in_srgb,var(--accent-border-ink)_26%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--background-elevated))] px-2.5 py-1 text-xs font-semibold text-[var(--accent-ink)]">
              Step {currentStepNumber} of {totalSteps}
            </span>
            <span className="inline-flex max-w-full items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--text-secondary)]">
              {sectionKindLabel}
            </span>
          </div>

          <Heading
            id={headingId}
            level={2}
            className="max-w-3xl text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-3xl"
          >
            {sectionTitle}
          </Heading>

          <p className="max-w-3xl text-base leading-7 app-text-muted">
            {sectionDescription ??
              "Work through this section, try the practice, then move on when it feels steady."}
          </p>
        </div>

        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--background-muted)]"
          role="meter"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressValue}
        >
          <div
            className="h-full rounded-full [background:var(--accent-progress-gradient)]"
            style={{ width: progressLabel }}
          />
        </div>

        <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
          {progressValue}% of lesson sections opened
        </p>
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
      className={["relative overflow-hidden rounded-xl border", styles.shell, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-3 border-b border-[var(--border-subtle)] p-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            className={[
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
              styles.icon,
            ].join(" ")}
          >
            <AppIcon icon={blockIcon} size={17} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="app-text-meta app-text-soft">{eyebrow}</div>

            {title ? (
              <Heading
                level={headingLevel}
                className="mt-0.5 text-lg font-bold leading-tight text-[var(--text-primary)]"
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

      <div className={["p-3.5 md:p-4", contentClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </section>
  );
}
