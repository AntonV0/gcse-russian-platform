import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import {
  buildFaqJsonLd,
  buildLearningResourceJsonLd,
} from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Tutor and Course Guide",
  description:
    "Compare GCSE Russian tutors, online lessons, and structured course access for Pearson Edexcel 1RU0 preparation.",
  path: "/gcse-russian-tutor",
  ogTitle: "GCSE Russian Tutor or Online Course?",
  ogDescription:
    "Compare tutor feedback, online lessons, independent study, and structured platform access.",
  ogImagePath: getOgImagePath("tutor"),
  ogImageAlt: "GCSE Russian tutor or online course guide",
});

type SupportItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type ComparisonItem = {
  need: string;
  course: string;
  tutor: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const supportOptions = [
  {
    title: "Structured course",
    description:
      "Best when the student needs a route through lessons, vocabulary, grammar, exam practice, and revision.",
    icon: "courses",
  },
  {
    title: "Online lessons",
    description:
      "Best when the student needs explanation, speaking practice, writing feedback, or weekly accountability.",
    icon: "teacher",
  },
  {
    title: "Blended route",
    description:
      "Best when the family wants the course to organise study and a teacher to sharpen the difficult skills.",
    icon: "layers",
  },
] satisfies SupportItem[];

const comparison = [
  {
    need: "Knowing what to study next",
    course: "Gives the route and keeps progress visible.",
    tutor: "Can explain priorities but may still need a shared structure.",
    icon: "navigation",
  },
  {
    need: "Speaking confidence",
    course: "Builds vocabulary, answer patterns, and exam awareness.",
    tutor: "Can prompt live answers, correct pronunciation, and build fluency.",
    icon: "speaking",
  },
  {
    need: "Writing accuracy",
    course: "Prepares grammar, translation, and task routines.",
    tutor: "Can mark patterns of error and help the student rewrite better answers.",
    icon: "write",
  },
  {
    need: "Accountability",
    course: "Shows the next task and makes independent study less vague.",
    tutor: "Creates a regular appointment and external expectation.",
    icon: "calendar",
  },
] satisfies ComparisonItem[];

const tutorQuestions = [
  {
    title: "Do they know Pearson Edexcel 1RU0?",
    description:
      "A GCSE Russian tutor should understand the four papers, Foundation/Higher routes, and the speaking window.",
    icon: "school",
  },
  {
    title: "How will feedback be handled?",
    description:
      "Ask how speaking, writing, grammar, and translation mistakes will be corrected and revisited.",
    icon: "feedback",
  },
  {
    title: "What happens between lessons?",
    description:
      "A weekly lesson works better when the student has clear practice to complete before the next session.",
    icon: "completed",
  },
] satisfies SupportItem[];

const warningSigns = [
  {
    title: "Only conversation, no exam plan",
    description:
      "Conversation helps, but GCSE Russian also needs paper-specific technique, writing, translation, and tier awareness.",
    icon: "warning",
  },
  {
    title: "Only worksheets, no feedback",
    description:
      "More material is not enough if the student never finds out what to fix.",
    icon: "question",
  },
  {
    title: "No practice between sessions",
    description:
      "A tutor hour cannot carry the whole course if vocabulary and grammar are not practised during the week.",
    icon: "pending",
  },
] satisfies SupportItem[];

const relatedLinks = [
  {
    title: "Online GCSE Russian lessons",
    description: "See how live support can sit alongside the platform.",
    href: "/online-gcse-russian-lessons",
    icon: "teacher" as const,
  },
  {
    title: "GCSE Russian course",
    description: "Review the structured self-study route before choosing support.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "GCSE Russian for parents",
    description: "Understand what families should check before committing.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "GCSE Russian pricing",
    description: "Compare course access before adding live support.",
    href: "/pricing",
    icon: "pricing" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

const faqs: FaqItem[] = [
  {
    question: "Is a GCSE Russian tutor better than an online course?",
    answer:
      "They solve different problems. A tutor gives live feedback and accountability; a course gives structure, practice, and a route students can follow between lessons.",
  },
  {
    question: "When should families add live lessons?",
    answer:
      "Live lessons are especially useful when a student needs speaking practice, writing correction, grammar explanation, or a regular external routine.",
  },
  {
    question: "Can the course support tutoring?",
    answer:
      "Yes. A structured course can give tutors and families a clearer view of what the student has covered and what still needs work.",
  },
  {
    question: "What should parents ask a GCSE Russian tutor?",
    answer:
      "Ask about Pearson Edexcel 1RU0 experience, speaking preparation, writing feedback, private-candidate awareness, and how homework will connect to exam skills.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function TutorVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Support choice</p>
            <p className="mt-1 text-xl font-bold">Course route + targeted feedback</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon="teacher" size={24} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Course", "Structure, practice, progress", "courses"],
          ["Tutor", "Correction, confidence, accountability", "teacher"],
          ["Student", "Practises between support sessions", "student"],
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
              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OptionsSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Choosing support</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Start with the problem you are trying to solve.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            A tutor is not automatically better than a course, and a course is not
            automatically enough. The right route depends on what is blocking progress.
          </p>
        </div>

        <div className="grid gap-4">
          {supportOptions.map((item) => (
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

function ComparisonSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.58fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Course or tutor?</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Compare by learning need, not by label.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Most families do not need an either/or answer. They need to know what each
            kind of support is good at.
          </p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          <div className="hidden grid-cols-[2.4rem_1fr_1fr] gap-4 px-5 py-4 text-xs font-bold uppercase text-[var(--text-muted)] md:grid">
            <span />
            <span>Course helps with</span>
            <span>Tutor helps with</span>
          </div>
          {comparison.map((item) => (
            <div
              key={item.need}
              className="grid gap-4 p-5 md:grid-cols-[2.4rem_1fr_1fr] md:items-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {item.need}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.course}
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] md:sr-only">
                  Tutor
                </h3>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {item.tutor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuestionsSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="grid gap-6 sm:grid-cols-3">
        {tutorQuestions.map((item) => (
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

      <div>
        <Eyebrow>Questions to ask</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          A good tutor conversation should get specific quickly.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          GCSE Russian support should connect to Pearson Edexcel 1RU0, the four papers,
          the student’s tier route, and what happens between sessions.
        </p>
      </div>
    </section>
  );
}

function WarningSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
        <div>
          <Eyebrow>What to avoid</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Support should not become another disconnected resource.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The best support leaves the student clearer about what to do next, not just
            reassured for an hour.
          </p>
        </div>

        <div className="grid gap-3">
          {warningSigns.map((item) => (
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

function RelatedLinksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Useful next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Compare the support routes
          </h2>
        </div>
        <Button href="/online-gcse-russian-lessons" variant="secondary" icon="teacher">
          Online lessons
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent-ink)]"
          >
            <AppIcon icon={link.icon} size={18} className="mb-3 text-[var(--accent-ink)]" />
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
        <Eyebrow>Tutor questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What families usually need to compare
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

export default function GcseRussianTutorPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "GCSE Russian Tutor and Course Guide",
            description:
              "A guide comparing GCSE Russian tutors, online lessons, and structured course access for Pearson Edexcel 1RU0 preparation.",
            path: "/gcse-russian-tutor",
            keywords: [
              "GCSE Russian tutor",
              "Russian GCSE tutor",
              "online Russian lessons GCSE",
            ],
            relatedLinks,
          }),
          buildFaqJsonLd(faqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: "Tutor guide", href: "/gcse-russian-tutor" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="teacher">
                Tutor comparison
              </Badge>
              <Badge tone="muted" icon="courses">
                Course platform
              </Badge>
              <Badge tone="muted" icon="speaking">
                Speaking and writing support
              </Badge>
            </div>

            <Eyebrow>GCSE Russian tutor or online course?</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Choose support by what the student actually needs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Families often compare tutors, online lessons, and course access. The best
              answer depends on whether the student needs structure, feedback,
              accountability, or a blended route.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button
                href="/online-gcse-russian-lessons"
                variant="secondary"
                icon="teacher"
              >
                Online lessons
              </Button>
            </div>
          </div>

          <TutorVisual />
        </section>

        <OptionsSection />
        <ComparisonSection />
        <QuestionsSection />
        <WarningSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Compare support with the course in front of you.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Start by seeing the course structure, then decide whether self-study,
                online lessons, or a blended route is the best fit.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/pricing" variant="secondary" icon="pricing">
                View pricing
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
