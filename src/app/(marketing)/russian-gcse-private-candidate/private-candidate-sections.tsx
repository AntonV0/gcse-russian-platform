import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import type { AppIconKey } from "@/lib/shared/icons";

import {
  candidateTypes,
  centreChecklist,
  courseFit,
  faqs,
  firstDecisions,
  prepRoute,
  relatedLinks,
} from "./private-candidate-data";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

export function CandidatePlanVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Private candidate plan</p>
            <p className="mt-1 text-xl font-bold">Preparation and entry stay separate</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            1RU0
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Learning route", "Course, vocabulary, grammar, practice", "courses"],
          ["Exam centre", "Entry, deadlines, fees, ID", "school"],
          ["Speaking", "Arrangements plus repeated practice", "speaking"],
        ].map(([label, value, icon]) => (
          <div
            key={label}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon={icon as AppIconKey} size={19} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border-subtle)] p-4">
        <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
          Important boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          The platform can organise preparation, but the exam centre controls entry and
          assessment arrangements.
        </p>
      </div>
    </div>
  );
}

export function FirstDecisionsSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Private candidates have two tracks to manage.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The student needs to learn the course. The family also needs to arrange exam
            entry. Keeping those tracks separate makes the whole process calmer.
          </p>
        </div>

        <div className="grid gap-4">
          {firstDecisions.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
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

export function PrepRouteSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="relative grid gap-4">
        <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
        {prepRoute.map((item, index) => (
          <div
            key={item.title}
            className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
          >
            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)] ring-4 ring-[var(--surface-elevated)]">
              <AppIcon icon={item.icon} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--accent-ink)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Eyebrow>Preparation route</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          A private candidate should not be left to assemble the course alone.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Independent preparation still needs order: foundations before harder paper
          practice, regular speaking, and mistake review that feeds back into lessons.
        </p>
      </div>
    </section>
  );
}

export function CentreChecklistSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Exam centre checklist</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Ask centre questions before the revision plan depends on them.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Centre policies can vary. Families should confirm details directly rather than
            assuming private-candidate entry works the same everywhere.
          </p>
        </div>

        <div className="grid divide-y divide-[var(--border-subtle)]">
          {centreChecklist.map((item) => (
            <div key={item.title} className="grid gap-4 p-5 sm:grid-cols-[2.5rem_1fr]">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">
                  {item.question}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.whyItMatters}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CandidateTypesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Who this route helps</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Private candidate does not mean one type of learner.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The same qualification can attract heritage speakers, independent learners, and
          families returning to Russian after gaps. The preparation route should respond
          to the actual student.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {candidateTypes.map((item) => (
          <div key={item.title} className="border-t-2 border-[var(--accent-fill)] pt-5">
            <AppIcon icon={item.icon} size={22} className="text-[var(--accent-ink)]" />
            <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CourseFitSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Where GCSERussian.com fits</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Preparation can be structured even when exam entry is separate.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The course can give the student a learning path while the family handles
            centre arrangements in parallel.
          </p>
        </div>

        <div className="grid gap-3">
          {courseFit.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
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

export function RelatedLinksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Useful next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Keep preparation and logistics moving
          </h2>
        </div>
        <Button href="/signup" variant="primary" icon="create">
          Start trial
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent-ink)]"
          >
            <AppIcon
              icon={link.icon}
              size={18}
              className="mb-3 text-[var(--accent-ink)]"
            />
            {link.title}
            <span className="mt-2 block text-xs font-normal leading-5 text-[var(--text-secondary)]">
              {link.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
      <div>
        <Eyebrow>Private candidate questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          Details families should settle early
        </h2>
      </div>
      <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {faqs.map((item) => (
          <div key={item.question} className="py-5">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
