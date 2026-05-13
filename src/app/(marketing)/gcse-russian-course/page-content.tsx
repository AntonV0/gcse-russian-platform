import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildCourseJsonLd, buildFaqJsonLd } from "@/lib/seo/structured-data";

import { audiences, faqs, relatedLinks } from "./course-page-data";
import {
  CourseArchitectureVisual,
  CourseIncludesSection,
  CourseMapVisual,
  ExamPaperSection,
  Eyebrow,
  LessonFlowVisual,
  PublicAppSection,
  TierComparisonSection,
} from "./course-page-sections";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Course",
  description:
    "Explore a structured online GCSE Russian course for Pearson Edexcel 1RU0, with Foundation and Higher pathways, short guided lessons, vocabulary, grammar, exam practice, and progress tracking.",
  path: "/gcse-russian-course",
  ogTitle: "Online GCSE Russian Course",
  ogDescription:
    "A structured Pearson Edexcel 1RU0 course with lessons, grammar, vocabulary, and exam practice.",
  ogImagePath: getOgImagePath("course"),
  ogImageAlt: "Online GCSE Russian Course",
});

export default function GcseRussianCoursePage() {
  return (
    <>
      <JsonLd
        data={[
          buildCourseJsonLd({
            name: "Online GCSE Russian Course",
            description:
              "A structured self-study GCSE Russian course for Pearson Edexcel 1RU0 students, with Foundation and Higher pathways, guided lessons, grammar, vocabulary, exam practice, and progress tracking.",
            path: "/gcse-russian-course",
          }),
          buildFaqJsonLd(faqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Course", href: "/gcse-russian-course" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
              <Badge tone="success" icon="unlocked">
                Trial-first access
              </Badge>
            </div>

            <Eyebrow>Inside the GCSE Russian course</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-[1.04] text-[var(--text-primary)] md:text-6xl">
              From first lesson to mock practice, the route stays visible.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              This page explains the actual course model: how students move through
              foundations, GCSE themes, exam-paper skills, revision, and mocks, with
              Foundation and Higher pathways handled inside one platform.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/pricing" variant="secondary" icon="pricing">
                View pricing
              </Button>
            </div>
          </div>

          <CourseArchitectureVisual />
        </section>

        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
            <div>
              <Eyebrow>Course map</Eyebrow>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
                The course is layered, not just theme-based.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
                Students begin with orientation and language foundations, then move
                through themes, paper skills, revision, and mocks. The goal is steady
                progression rather than random topic hopping.
              </p>
            </div>
            <CourseMapVisual />
          </div>
        </section>

        <TierComparisonSection />

        <section className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Lesson architecture</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
              Each lesson has a job.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              Lessons are built from ordered sections and reusable blocks. A student can
              learn the idea, practise it safely, then apply it to something closer to a
              GCSE task.
            </p>
          </div>
          <LessonFlowVisual />
        </section>

        <ExamPaperSection />

        <CourseIncludesSection />

        <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
          <div className="grid lg:grid-cols-[0.78fr_1fr]">
            <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
              <Eyebrow>Who the course is for</Eyebrow>
              <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                One course structure, several learning situations.
              </h2>
              <p className="mt-4 text-base leading-7 opacity-80">
                The same course model can support independent self-study, parent-guided
                preparation, private-candidate planning, and teacher-led Volna workflows.
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

        <PublicAppSection />

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <Eyebrow>Course questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--text-primary)]">
              Details families usually check
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
              <Eyebrow>Related pages</Eyebrow>
              <h2 className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
                Useful next decisions
              </h2>
            </div>
            <Button href="/signup" variant="primary" icon="create">
              Start trial
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                Try the course structure before choosing a plan.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create a trial account first, look around the learning environment, then
                upgrade from inside the app when the course is the right fit.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/pricing" variant="secondary" icon="pricing">
                Compare pricing
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
