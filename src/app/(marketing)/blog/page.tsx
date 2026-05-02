import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "GCSE Russian Articles",
    description:
      "Planned GCSE Russian exam advice, revision routines, vocabulary and grammar guidance, and course updates from GCSERussian.com.",
    path: "/blog",
    ogTitle: "GCSE Russian Articles",
    ogDescription:
      "A planned article library for GCSE Russian exam advice, revision routines, vocabulary, grammar, and course updates.",
    ogImagePath: getOgImagePath("blog"),
    ogImageAlt: "GCSE Russian articles and revision guidance",
  }),
  robots: noIndexRobots,
};

type ArticleTrack = {
  title: string;
  description: string;
  icon: AppIconKey;
};

const plannedTracks = [
  {
    title: "Exam strategy",
    description:
      "Practical explainers for listening, speaking, reading, writing, tier choice, and paper-by-paper preparation.",
    icon: "exam",
  },
  {
    title: "Revision routines",
    description:
      "Short weekly plans that connect vocabulary, grammar, question practice, mocks, and mistake review.",
    icon: "calendar",
  },
  {
    title: "Vocabulary and grammar",
    description:
      "Focused guidance on high-frequency language, sentence control, translation, and using grammar in answers.",
    icon: "vocabulary",
  },
  {
    title: "Parents and private candidates",
    description:
      "Plain-English planning notes for family support, independent study, exam-centre questions, and live support decisions.",
    icon: "users",
  },
] satisfies ArticleTrack[];

const publishingPrinciples = [
  "Every article should answer a real decision, not just target a keyword.",
  "Advice should link back to live course practice or a stronger public guide.",
  "Parent-facing content should explain how to support the routine without becoming the teacher.",
  "Exam guidance should stay independent and point formal specification details back to Pearson where needed.",
];

const liveGuides = [
  {
    title: "Resources library",
    description: "Browse the live guide hub for exam, revision, grammar, and vocabulary pages.",
    href: "/resources",
    icon: "lessonContent" as const,
  },
  {
    title: "Exam guide",
    description: "Understand the four papers and how students should prepare for each one.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Revision guide",
    description: "Build a repeatable routine across vocabulary, grammar, papers, and mocks.",
    href: "/gcse-russian-revision",
    icon: "calendar" as const,
  },
  {
    title: "Course",
    description: "See how the self-study route turns guidance into lessons and practice.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function BlogVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Article library</p>
            <p className="mt-1 text-xl font-bold">Editorial plan</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            Soon
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {plannedTracks.slice(0, 3).map((track, index) => (
          <div
            key={track.title}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon={track.icon} size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {track.title}
                </p>
                <div className="mt-2 h-2 rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className="h-2 rounded-full bg-[var(--accent-fill)]"
                    style={{ width: `${56 + index * 12}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4">
        <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
          First useful direction
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Until articles are published, the live guide library is the better place for
          exam preparation advice.
        </p>
      </div>
    </div>
  );
}

function PlannedTracksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Planned coverage</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Articles should deepen the guides, not repeat them.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The blog will be strongest when each article answers one narrow problem:
            what to revise next, how to approach a paper, or how a family can make a
            better support decision.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {plannedTracks.map((track) => (
            <div
              key={track.title}
              className="rounded-lg bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={track.icon} size={21} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-[var(--text-primary)]">
                {track.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {track.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublishingPrinciplesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.44fr] lg:items-center">
      <div className="grid gap-4 sm:grid-cols-2">
        {publishingPrinciples.map((principle, index) => (
          <div key={principle} className="border-t-2 border-[var(--accent-fill)] pt-5">
            <span className="text-sm font-extrabold text-[var(--accent-ink)]">
              0{index + 1}
            </span>
            <p className="mt-3 text-base font-bold leading-6 text-[var(--text-primary)]">
              {principle}
            </p>
          </div>
        ))}
      </div>
      <div>
        <Eyebrow>Editorial standard</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Useful before searchable.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The article library is intentionally not indexed yet. It should launch only
          when it can feel like a serious GCSE Russian reference, with clear internal
          routes into the course and existing guides.
        </p>
      </div>
    </section>
  );
}

function LiveGuidesSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Use now</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Live pages for GCSE Russian decisions
          </h2>
        </div>
        <Button href="/resources" variant="secondary" icon="lessonContent">
          View resources
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {liveGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent-ink)]"
          >
            <AppIcon icon={guide.icon} size={18} className="mb-3 text-[var(--accent-ink)]" />
            {guide.title}
            <span className="mt-2 block text-xs font-normal leading-5 text-[var(--text-secondary)]">
              {guide.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function MarketingBlogPage() {
  return (
    <>
      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Articles", href: "/blog" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="muted" icon="lessonContent">
                Article library
              </Badge>
              <Badge tone="info" icon="exam">
                Exam advice
              </Badge>
              <Badge tone="success" icon="calendar">
                Revision routines
              </Badge>
            </div>

            <Eyebrow>GCSE Russian articles</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              A future home for focused GCSE Russian guidance.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              This article library is being prepared for exam advice, revision routines,
              vocabulary and grammar guidance, parent notes, and course updates. For now,
              the live guides below are the best place to start.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/resources" variant="primary" icon="lessonContent">
                Browse resources
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                View course
              </Button>
            </div>
          </div>

          <BlogVisual />
        </section>

        <PlannedTracksSection />
        <PublishingPrinciplesSection />
        <LiveGuidesSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Need something practical today?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                The course and guide library already cover the main preparation decisions
                students and families need before articles launch.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/gcse-russian-exam-guide" variant="secondary" icon="exam">
                View exam guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
