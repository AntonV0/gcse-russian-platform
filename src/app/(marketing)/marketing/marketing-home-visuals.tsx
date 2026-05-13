import AppIcon from "@/components/ui/app-icon";

import { courseLayers, lessonBlocks, practiceSurfaces } from "./marketing-home-data";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="app-text-meta text-[var(--accent-ink)]">{children}</p>;
}

function ScreenshotShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background-muted)] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-fill)]" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function StudyDeskIllustration() {
  return (
    <div
      className="relative min-h-[210px] overflow-hidden rounded-lg border border-[var(--border-subtle)] [background:var(--accent-gradient-soft)] p-5 shadow-[var(--shadow-md)]"
      aria-label="Illustration of GCSE Russian study materials"
      role="img"
    >
      <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)] shadow-[var(--shadow-sm)]">
        <AppIcon icon="listening" size={26} />
      </div>
      <div className="absolute bottom-5 left-5 right-16 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--accent-ink)]">
          GCSE Russian notes
        </p>
        <p
          lang="ru"
          className="mt-3 text-2xl font-bold leading-tight text-[var(--text-primary)]"
        >
          Ð¯ Ð´ÑƒÐ¼Ð°ÑŽ...
        </p>
        <div className="mt-4 grid gap-2">
          <span className="h-2 w-3/4 rounded-full bg-[var(--background-muted)]" />
          <span className="h-2 w-1/2 rounded-full bg-[var(--background-muted)]" />
        </div>
      </div>
      <div className="absolute left-6 top-6 rounded-md bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)]">
        1RU0
      </div>
      <div className="absolute bottom-10 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-[var(--shadow-md)]">
        <AppIcon icon="pencil" size={22} />
      </div>
    </div>
  );
}

export function HeroProductVisual() {
  return (
    <div className="relative grid gap-4">
      <StudyDeskIllustration />
      <ScreenshotShell title="Student dashboard" className="relative z-10">
        <div className="space-y-4 p-4">
          <div className="rounded-lg marketing-dark-panel p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs opacity-70">Next step</p>
                <p className="mt-1 text-lg font-semibold">Present tense essentials</p>
              </div>
              <span className="rounded-md bg-[var(--accent-fill)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-on-fill)]">
                Step 3 of 6
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background)]/20">
              <div className="h-full w-[58%] rounded-full bg-[var(--accent-fill)]" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="text-xs font-semibold text-[var(--text-muted)]">Course</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                Foundation pathway
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="text-xs font-semibold text-[var(--text-muted)]">Practice</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                12 questions ready
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--background-muted)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Today&apos;s route
              </p>
              <AppIcon icon="learning" size={17} className="text-[var(--accent-ink)]" />
            </div>
            {["Vocabulary warm-up", "Grammar in use", "Reading task"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 border-t border-[var(--border-subtle)] py-2 first:border-t-0"
              >
                <AppIcon icon="confirm" size={14} className="text-[var(--accent-ink)]" />
                <span className="text-sm text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </ScreenshotShell>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]">
          <AppIcon icon="vocabulary" size={18} className="text-[var(--accent-ink)]" />
          <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
            Theme vocabulary
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]">
          <AppIcon icon="mockExam" size={18} className="text-[var(--accent-ink)]" />
          <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
            Mock practice
          </p>
        </div>
      </div>
    </div>
  );
}

export function CourseMapVisual() {
  return (
    <div className="relative grid gap-3">
      <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
      {courseLayers.map((layer, index) => (
        <div
          key={layer.title}
          className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]"
        >
          <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)] ring-4 ring-[var(--background-muted)]">
            <AppIcon icon={layer.icon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--accent-ink)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {layer.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
              {layer.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LessonVisual() {
  return (
    <ScreenshotShell title="Lesson section">
      <div className="grid gap-0 md:grid-cols-[1fr_220px]">
        <div className="space-y-4 p-4">
          <div className="rounded-lg bg-[var(--background-muted)] p-4">
            <p className="text-xs font-semibold text-[var(--accent-ink)]">
              Current section
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              Opinions and reasons
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Build a simple opinion, add a reason, then use it in a GCSE-style answer.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {lessonBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-lg border border-[var(--border-subtle)] p-3"
              >
                <AppIcon
                  icon={block.icon}
                  size={17}
                  className="text-[var(--accent-ink)]"
                />
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                  {block.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {block.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] p-4">
            <p lang="ru" className="text-sm font-semibold text-[var(--text-primary)]">
              Ð¯ Ð´ÑƒÐ¼Ð°ÑŽ, Ñ‡Ñ‚Ð¾ Ñ€ÑƒÑÑÐºÐ¸Ð¹ Ð¿Ð¾Ð»ÐµÐ·Ð½Ñ‹Ð¹, Ð¿Ð¾Ñ‚Ð¾Ð¼Ñƒ Ñ‡Ñ‚Ð¾...
            </p>
            <div className="mt-3 h-2 w-2/3 rounded-full bg-[var(--accent-fill)]" />
          </div>
        </div>

        <aside className="border-t border-[var(--border-subtle)] bg-[var(--background-muted)] p-4 md:border-l md:border-t-0">
          <p className="text-xs font-semibold text-[var(--text-muted)]">Steps</p>
          {["Intro", "Core teaching", "Guided practice", "Exam practice"].map(
            (step, index) => (
              <div
                key={step}
                className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    index < 2
                      ? "bg-[var(--accent-fill)] text-[var(--accent-on-fill)]"
                      : "bg-[var(--surface-elevated)] text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                {step}
              </div>
            )
          )}
        </aside>
      </div>
    </ScreenshotShell>
  );
}

export function PracticeVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {practiceSurfaces.map((surface) => (
        <div
          key={surface.title}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <AppIcon icon={surface.icon} size={20} className="text-[var(--accent-ink)]" />
            <span className="h-2 w-16 rounded-full bg-[var(--background-muted)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {surface.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {surface.description}
          </p>
        </div>
      ))}
    </div>
  );
}
