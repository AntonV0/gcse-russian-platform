import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd } from "@/lib/seo/structured-data";

import {
  audiences,
  faqs,
  guideLinks,
  primaryLinks,
  problemSolutions,
  productHighlights,
  proofItems,
  trialIncludes,
} from "./marketing-home-data";
import {
  CourseMapVisual,
  Eyebrow,
  HeroProductVisual,
  LessonVisual,
  PracticeVisual,
} from "./marketing-home-visuals";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Online Course",
  description:
    "A structured self-study GCSE Russian course for Pearson Edexcel 1RU0 students and families, with Foundation and Higher pathways, lessons, vocabulary, grammar, exam practice, and progress tracking.",
  path: "/marketing",
});

export default function MarketingHomePage() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqs)} />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="success" icon="unlocked">
                Trial before checkout
              </Badge>
            </div>

            <Eyebrow>GCSE Russian self-study course</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-[1.04] text-[var(--text-primary)] md:text-6xl">
              GCSE Russian with a route students can actually follow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              A self-study course for Pearson Edexcel 1RU0: short lessons, vocabulary,
              grammar, exam-style practice, mock preparation, and visible progress.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/courses" variant="secondary" icon="preview">
                Preview app first
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                See course details
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {proofItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <AppIcon
                    icon="confirm"
                    size={16}
                    className="text-[var(--accent-ink)]"
                  />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <HeroProductVisual />
        </section>

        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
            <div>
              <Eyebrow>Why structure matters</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
                The course is built for the moments where GCSE Russian usually unravels.
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {problemSolutions.map((item) => (
                <div
                  key={item.problem}
                  className="grid gap-4 py-5 sm:grid-cols-[2.5rem_1fr]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                    <AppIcon icon={item.icon} size={20} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <p className="text-sm font-semibold leading-6 text-[var(--text-primary)]">
                      {item.problem}
                    </p>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-lg marketing-dark-panel p-5 shadow-[var(--shadow-lg)] sm:p-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--accent-ink)]">
              Trial access
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight">
              Preview the app first, then create a trial when you want progress saved.
            </h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button href="/courses" variant="inverse" icon="preview">
                Open app preview
              </Button>
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trialIncludes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2"
              >
                <AppIcon icon="confirm" size={15} className="text-[var(--accent-ink)]" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-[var(--border-subtle)] py-8 md:grid-cols-3">
          {productHighlights.map((item) => (
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
        </section>

        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.65fr)] lg:items-center">
            <div>
              <Eyebrow>Course map</Eyebrow>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
                Built as a course, not a folder of worksheets.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                The route starts with foundations, moves through GCSE themes, then builds
                paper-specific skills and revision. Foundation and Higher content can
                share sections where useful and separate where difficulty changes.
              </p>
            </div>
            <CourseMapVisual />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.5fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Inside a lesson</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
              Learn, practise, apply.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Lessons are split into ordered sections so students do not skip straight to
              the hardest task. They can revisit earlier sections, but the next step stays
              obvious.
            </p>
          </div>
          <LessonVisual />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.48fr] lg:items-center">
          <PracticeVisual />
          <div>
            <Eyebrow>Practice surfaces</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
              The app connects the parts students usually revise separately.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Vocabulary, grammar, question sets, mock exams, and official resource links
              each have their place, so preparation feels structured rather than
              scattered.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
          <div className="grid lg:grid-cols-[0.78fr_1fr]">
            <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
              <Eyebrow>Who it helps</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                Designed for the family reality of GCSE Russian.
              </h2>
              <p className="mt-4 text-base leading-7 opacity-80">
                Students need clarity. Parents need confidence. Private candidates need a
                route that separates learning from exam-entry logistics.
              </p>
            </div>
            <div className="grid divide-y divide-[var(--border-subtle)]">
              {audiences.map((item) => (
                <div key={item.title} className="flex gap-4 p-5 sm:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                    <AppIcon icon={item.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
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

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)]">
              Before you start
            </h2>
          </div>
          <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {faqs.map((item) => (
              <div key={item.question} className="py-5">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Explore the site</Eyebrow>
              <h2 className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
                Deeper pages for specific decisions
              </h2>
            </div>
            <Button href="/resources" variant="secondary" icon="lessonContent">
              View resources
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent-ink)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {guideLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent-ink)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                Try the course before deciding.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Look around the app preview, then create a trial account when the student
                is ready to choose a path and save progress.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/courses" variant="inverse" icon="preview">
                Preview app
              </Button>
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
