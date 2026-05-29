import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";

import {
  courseIncludes,
  courseLayers,
  examPapers,
  lessonFlow,
  publicAppSplit,
  tierComparison,
} from "./course-page-data";

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

export function CourseArchitectureVisual() {
  return (
    <ScreenshotShell title="Course structure">
      <div className="space-y-4 p-4">
        <div className="rounded-lg marketing-dark-panel p-4">
          <p className="text-xs opacity-70">GCSE Russian</p>
          <p className="mt-1 text-xl font-semibold">Foundation and Higher pathways</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="rounded-md bg-[var(--background)]/10 px-3 py-2 text-sm">
              Foundation
            </span>
            <span className="rounded-md bg-[var(--accent-fill)] px-3 py-2 text-sm font-semibold text-[var(--accent-on-fill)]">
              Higher
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          {["Course", "Variant", "Module", "Lesson", "Section", "Block"].map(
            (item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--background-muted)] text-xs font-semibold text-[var(--accent-ink)]">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {item}
                </span>
                {index < 5 ? (
                  <AppIcon icon="down" size={14} className="text-[var(--text-muted)]" />
                ) : (
                  <AppIcon
                    icon="completed"
                    size={14}
                    className="text-[var(--accent-ink)]"
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </ScreenshotShell>
  );
}

export function CourseMapVisual() {
  return (
    <div className="grid gap-3">
      {courseLayers.map((layer, index) => (
        <div
          key={layer.title}
          className="grid gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)] sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-start"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
            <AppIcon icon={layer.icon} size={21} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--accent-ink)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {layer.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {layer.description}
            </p>
          </div>
          <span className="rounded-md bg-[var(--background-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
            {layer.time}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LessonFlowVisual() {
  return (
    <ScreenshotShell title="Lesson design">
      <div className="grid gap-0 lg:grid-cols-[1fr_210px]">
        <div className="p-4">
          <div className="rounded-lg bg-[var(--background-muted)] p-4">
            <p className="text-xs font-semibold text-[var(--accent-ink)]">
              Current lesson
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
              Opinions and justifications
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Students build from a model answer into their own GCSE-style response.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
              <div className="h-full w-[66%] rounded-full bg-[var(--accent-fill)]" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {lessonFlow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-[var(--border-subtle)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <AppIcon
                    icon={step.icon}
                    size={19}
                    className="text-[var(--accent-ink)]"
                  />
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] p-4">
            <p lang="ru" className="text-sm font-semibold text-[var(--text-primary)]">
              Я считаю, что русский полезный, потому что...
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {["opinion", "reason", "exam answer"].map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-[var(--background-muted)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="border-t border-[var(--border-subtle)] bg-[var(--background-muted)] p-4 lg:border-l lg:border-t-0">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Lesson blocks
          </p>
          <div className="mt-4 grid gap-3">
            {["Explanation", "Vocabulary", "Grammar", "Exam tip", "Question set"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-md bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]"
                >
                  <AppIcon icon="blocks" size={15} className="text-[var(--accent-ink)]" />
                  {item}
                </div>
              )
            )}
          </div>
        </aside>
      </div>
    </ScreenshotShell>
  );
}

export function TierComparisonSection() {
  return (
    <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-0 lg:grid-cols-[0.58fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8">
          <Eyebrow>Foundation and Higher</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            One course route, with tier decisions handled deliberately.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Students should not feel as if they are switching to a different product when
            tier changes. Shared content stays shared; harder work appears when it is
            useful.
          </p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          <div className="hidden grid-cols-[2.4rem_1fr_1fr] gap-4 px-5 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] md:grid">
            <span />
            <span>Foundation</span>
            <span>Higher</span>
          </div>
          {tierComparison.map((item) => (
            <div
              key={item.label}
              className="grid gap-4 p-5 md:grid-cols-[2.4rem_1fr_1fr] md:items-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.foundation}
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] md:sr-only">
                  Higher
                </h3>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {item.higher}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExamPaperSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Exam paper fit</Eyebrow>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
          The course keeps the four papers visible.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          GCSE Russian is not just topic knowledge. Students need to practise how that
          knowledge appears in listening, speaking, reading, and writing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {examPapers.map((paper) => (
          <div
            key={paper.paper}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-md bg-[var(--background-muted)] px-3 py-1 text-xs font-semibold text-[var(--accent-ink)]">
                {paper.paper}
              </span>
              <AppIcon icon={paper.icon} size={21} className="text-[var(--accent-ink)]" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
              {paper.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {paper.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PublicAppSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.62fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Before signup</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
            Let families look around the app before creating an account.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The public app preview shows how course routes, vocabulary, grammar, past
            papers, and mock practice fit together. Trial access is the next step when the
            student wants saved progress and lesson access.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href="/courses" variant="primary" icon="preview">
              Open app preview
            </Button>
            <Button href="/signup" variant="secondary" icon="create">
              Create trial account
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {publicAppSplit.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CourseIncludesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        {courseIncludes.map((item) => (
          <div key={item.title} className="border-t-2 border-[var(--accent-fill)] pt-5">
            <AppIcon icon={item.icon} size={22} className="text-[var(--accent-ink)]" />
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <div>
        <Eyebrow>What the platform connects</Eyebrow>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
          Lessons, practice, revision, and mocks belong in one system.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Students can study a topic, practise the language, then return to targeted
          revision without rebuilding their plan from scratch.
        </p>
      </div>
    </section>
  );
}
