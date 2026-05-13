import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd, buildLearningResourceJsonLd } from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Lessons",
  description:
    "Explore online GCSE Russian lessons and teacher-supported preparation for students who want structured guidance alongside the GCSE Russian course platform.",
  path: "/online-gcse-russian-lessons",
  ogTitle: "Online GCSE Russian Lessons",
  ogDescription:
    "Live teacher support, speaking practice, writing feedback, and a structured course platform.",
  ogImagePath: getOgImagePath("lessons"),
  ogImageAlt: "Online GCSE Russian lessons",
});

type LessonItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const supportNeeds = [
  {
    title: "Speaking practice",
    description:
      "Live lessons help students answer prompts aloud, improve pronunciation, and build confidence before the speaking window.",
    icon: "speaking",
  },
  {
    title: "Writing feedback",
    description:
      "A teacher can spot repeated grammar errors, weak task coverage, and places where the student needs cleaner sentence control.",
    icon: "write",
  },
  {
    title: "Accountability",
    description:
      "A regular lesson rhythm can keep progress moving when self-study starts to drift.",
    icon: "calendar",
  },
] satisfies LessonItem[];

const blendedRoute = [
  {
    title: "Course gives the route",
    description:
      "Lessons, vocabulary, grammar, revision, and paper practice stay organised inside the platform.",
    icon: "courses",
  },
  {
    title: "Teacher adds judgement",
    description:
      "Live support helps decide what needs explanation, correction, repetition, or a confidence boost.",
    icon: "teacher",
  },
  {
    title: "Student practises between sessions",
    description:
      "Online lessons work best when the student has specific tasks to complete before the next meeting.",
    icon: "completed",
  },
] satisfies LessonItem[];

const lessonFit = [
  {
    title: "Students who feel stuck",
    description:
      "Helpful when the student opens the course but still needs someone to explain why a pattern matters.",
    icon: "brain",
  },
  {
    title: "Parents wanting backup",
    description:
      "Useful when parents can support the routine but do not want to become the Russian teacher.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description:
      "Valuable for learners preparing outside school who need speaking practice, writing correction, and a weekly plan.",
    icon: "userCheck",
  },
] satisfies LessonItem[];

const lessonBoundaries = [
  {
    title: "Not every student needs live lessons",
    description:
      "Some students can make good progress with a structured course and a steady routine.",
    icon: "info",
  },
  {
    title: "Live lessons are not a shortcut",
    description:
      "A lesson can guide and correct, but students still need practice between sessions.",
    icon: "pending",
  },
  {
    title: "Exam logistics stay separate",
    description:
      "Private candidates still need to confirm entry, fees, deadlines, and speaking arrangements with an exam centre.",
    icon: "school",
  },
] satisfies LessonItem[];

const relatedLinks = [
  {
    title: "GCSE Russian tutor guide",
    description: "Compare tutors, online lessons, and structured course access.",
    href: "/gcse-russian-tutor",
    icon: "teacher" as const,
  },
  {
    title: "GCSE Russian speaking exam",
    description: "See why live practice can matter for Paper 2.",
    href: "/gcse-russian-speaking-exam",
    icon: "speaking" as const,
  },
  {
    title: "GCSE Russian writing exam",
    description: "Understand where feedback supports written accuracy.",
    href: "/gcse-russian-writing-exam",
    icon: "write" as const,
  },
  {
    title: "Private candidate guide",
    description: "Plan support when the student is preparing outside school.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

const lessonFaqs: FaqItem[] = [
  {
    question: "Who benefits most from online GCSE Russian lessons?",
    answer:
      "Students who need speaking practice, writing feedback, grammar explanation, accountability, or private-candidate guidance often benefit most.",
  },
  {
    question: "Can online lessons work alongside the course platform?",
    answer:
      "Yes. The platform provides structure and practice, while live teaching adds explanation, correction, and a weekly rhythm.",
  },
  {
    question: "Are online lessons necessary for every student?",
    answer:
      "No. Some students can work independently with a structured course. Others need live support, especially for speaking and writing.",
  },
  {
    question: "How do online lessons help with speaking?",
    answer:
      "A teacher can prompt spontaneous answers, correct pronunciation, practise role plays and picture tasks, and build confidence under exam-style pressure.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function LessonVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Teacher-supported route</p>
            <p className="mt-1 text-xl font-bold">Course structure plus live feedback</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon="teacher" size={24} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Before lesson", "Course task and question to bring", "lessonContent"],
          ["During lesson", "Explain, practise, correct, repeat", "speaking"],
          ["After lesson", "Focused practice before next session", "completed"],
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
    </div>
  );
}

function SupportNeedsSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>When live support helps</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Online lessons are most useful when the student needs feedback, not just more
            resources.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            A structured course can carry a lot of the weekly study. Live teaching is best
            used for the moments where correction, confidence, and judgement matter.
          </p>
        </div>

        <div className="grid gap-4">
          {supportNeeds.map((item) => (
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

function BlendedRouteSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="relative grid gap-4">
        <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
        {blendedRoute.map((item, index) => (
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
        <Eyebrow>Blended learning</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          The strongest support is usually course plus teacher, not teacher instead of
          course.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Live sessions are easier to use well when the student has a course route,
          assigned practice, and a clear record of what needs attention next.
        </p>
      </div>
    </section>
  );
}

function FitSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Who lessons are for</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Live support should match the student’s actual blocker.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Some students need structure. Some need explanation. Some need a human
            appointment so the work actually happens.
          </p>
        </div>

        <div className="grid divide-y divide-[var(--border-subtle)]">
          {lessonFit.map((item) => (
            <div key={item.title} className="grid gap-4 p-5 sm:grid-cols-[2.5rem_1fr]">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
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

function BoundarySection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Good expectations</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Lessons work best when everyone knows what they are for.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Clear boundaries make live support feel professional: what happens in the
          lesson, what the student practises alone, and what families still need to
          arrange.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {lessonBoundaries.map((item) => (
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

function RelatedLinksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Useful next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Decide where live support fits
          </h2>
        </div>
        <Button href="/gcse-russian-tutor" variant="secondary" icon="teacher">
          Compare support
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

function FaqSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
      <div>
        <Eyebrow>Online lesson questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What families usually ask before adding live support
        </h2>
      </div>
      <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {lessonFaqs.map((item) => (
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

export default function OnlineGcseRussianLessonsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Online GCSE Russian Lessons",
            description:
              "A guide to online GCSE Russian lessons and teacher-supported preparation alongside the GCSE Russian course platform.",
            path: "/online-gcse-russian-lessons",
            keywords: [
              "online GCSE Russian lessons",
              "GCSE Russian tutor",
              "Russian GCSE classes",
            ],
            relatedLinks,
          }),
          buildFaqJsonLd(lessonFaqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: "Online lessons", href: "/online-gcse-russian-lessons" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="teacher">
                Live teacher support
              </Badge>
              <Badge tone="muted" icon="speaking">
                Speaking and writing
              </Badge>
              <Badge tone="muted" icon="courses">
                Course platform
              </Badge>
            </div>

            <Eyebrow>Online GCSE Russian lessons</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Add live support where self-study needs a human rhythm.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Online GCSE Russian lessons can sit alongside the course platform for
              students who need speaking practice, writing feedback, grammar explanation,
              or accountability.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button
                href="https://volnaschool.com"
                variant="secondary"
                icon="externalLink"
              >
                Visit Volna School
              </Button>
            </div>
          </div>

          <LessonVisual />
        </section>

        <SupportNeedsSection />
        <BlendedRouteSection />
        <FitSection />
        <BoundarySection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Start with structure, then add teaching when it will help.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create a trial account to inspect the course route. If the student needs
                live support, lessons can provide correction, fluency, and accountability.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/gcse-russian-tutor" variant="secondary" icon="teacher">
                Compare support
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
