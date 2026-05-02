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
  title: "Russian GCSE Private Candidate Guide",
  description:
    "A practical Russian GCSE private candidate guide covering exam-centre planning, speaking arrangements, tier choice, preparation structure, and course support.",
  path: "/russian-gcse-private-candidate",
  ogTitle: "Russian GCSE Private Candidate Guide",
  ogDescription:
    "Plan GCSE Russian preparation, tier choice, speaking support, and exam-centre questions.",
  ogImagePath: getOgImagePath("private-candidates"),
  ogImageAlt: "Russian GCSE private candidate guide",
});

type CandidateItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type ChecklistItem = {
  title: string;
  question: string;
  whyItMatters: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const firstDecisions = [
  {
    title: "Exam centre",
    description:
      "Find a centre that accepts private candidates for Pearson Edexcel GCSE Russian and can explain its process.",
    icon: "school",
  },
  {
    title: "Speaking arrangements",
    description:
      "Ask early how the speaking paper is handled, because it is often the most complex part for private candidates.",
    icon: "speaking",
  },
  {
    title: "Preparation route",
    description:
      "Keep course learning, exam practice, and logistics separate enough that one delay does not stop all progress.",
    icon: "navigation",
  },
] satisfies CandidateItem[];

const prepRoute = [
  {
    title: "Orient",
    description:
      "Understand the Edexcel 1RU0 papers, Foundation/Higher choice, deadlines, and what the student already knows.",
    icon: "exam",
  },
  {
    title: "Build",
    description:
      "Work through vocabulary, grammar, lessons, and theme content so the student has language to use.",
    icon: "brain",
  },
  {
    title: "Practise",
    description:
      "Move into listening, speaking, reading, writing, translation, and question-set practice in a controlled way.",
    icon: "questionSet",
  },
  {
    title: "Rehearse",
    description:
      "Use mock-style tasks and mistake review without confusing platform-created practice with official papers.",
    icon: "mockExam",
  },
] satisfies CandidateItem[];

const centreChecklist = [
  {
    title: "Candidate acceptance",
    question: "Do you accept private candidates for Pearson Edexcel GCSE Russian 1RU0?",
    whyItMatters:
      "Not every centre offers every language qualification to private candidates.",
    icon: "userCheck",
  },
  {
    title: "Speaking paper",
    question: "How do you arrange, conduct, record, and submit the speaking assessment?",
    whyItMatters:
      "Speaking can be harder to arrange than written papers and usually needs earlier planning.",
    icon: "speaking",
  },
  {
    title: "Tier and deadlines",
    question: "When must Foundation or Higher be confirmed, and what are the entry deadlines?",
    whyItMatters:
      "Tier choice affects all papers, and late entries can create avoidable cost or availability problems.",
    icon: "calendar",
  },
  {
    title: "Fees and requirements",
    question: "What fees, ID requirements, access arrangements, and centre policies apply?",
    whyItMatters:
      "Families need the full administrative picture before relying on a revision timeline.",
    icon: "pricing",
  },
] satisfies ChecklistItem[];

const candidateTypes = [
  {
    title: "Heritage speakers",
    description:
      "Often need formal writing, translation accuracy, grammar control, and exam technique, even when speaking feels strong.",
    icon: "speaking",
  },
  {
    title: "Independent learners",
    description:
      "Usually need a steady course route so vocabulary, grammar, and paper practice do not become scattered.",
    icon: "student",
  },
  {
    title: "Families arranging entry",
    description:
      "Need clear separation between the learning plan and exam-centre administration.",
    icon: "users",
  },
] satisfies CandidateItem[];

const courseFit = [
  {
    title: "Course structure",
    description:
      "A route through foundations, GCSE themes, paper skills, revision, and mock preparation.",
    icon: "courses",
  },
  {
    title: "Optional live support",
    description:
      "Helpful when the student needs speaking practice, writing feedback, grammar help, or accountability.",
    icon: "teacher",
  },
  {
    title: "Exam-centre boundary",
    description:
      "The platform supports preparation; the family still confirms entry and arrangements with a centre.",
    icon: "info",
  },
] satisfies CandidateItem[];

const relatedLinks = [
  {
    title: "GCSE Russian for parents",
    description: "Understand how parents can support without taking over.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "Review the four papers and tier decisions before planning.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Online GCSE Russian lessons",
    description: "Add teacher guidance for speaking, writing, and accountability.",
    href: "/online-gcse-russian-lessons",
    icon: "teacher" as const,
  },
  {
    title: "GCSE Russian course",
    description: "See the self-study course route for independent preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

const faqs: FaqItem[] = [
  {
    question: "Can this platform enter a student for GCSE Russian?",
    answer:
      "No. The platform supports preparation. Families must arrange exam entry, fees, deadlines, and speaking arrangements directly with an exam centre.",
  },
  {
    question: "When should private candidates look for a centre?",
    answer:
      "As early as possible. Centre availability, fees, and speaking arrangements can vary, and the speaking assessment is planned before the written-paper period.",
  },
  {
    question: "Is GCSE Russian suitable for heritage speakers?",
    answer:
      "Often, yes, but heritage speakers still need formal exam preparation, especially for writing accuracy, translation, grammar, and paper technique.",
  },
  {
    question: "What support is most useful?",
    answer:
      "A structured course helps with coverage and routine. Live support is especially useful for speaking, writing feedback, grammar explanation, and accountability.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function CandidatePlanVisual() {
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
              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                {value}
              </p>
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

function FirstDecisionsSection() {
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

function PrepRouteSection() {
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

function CentreChecklistSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Exam centre checklist</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Ask centre questions before the revision plan depends on them.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Centre policies can vary. Families should confirm details directly rather
            than assuming private-candidate entry works the same everywhere.
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

function CandidateTypesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Who this route helps</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Private candidate does not mean one type of learner.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The same qualification can attract heritage speakers, independent learners,
          and families returning to Russian after gaps. The preparation route should
          respond to the actual student.
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

function CourseFitSection() {
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

function RelatedLinksSection() {
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

export default function RussianGcsePrivateCandidatePage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Russian GCSE Private Candidate Guide",
            description:
              "A practical guide for Russian GCSE private candidates and families planning exam preparation, course structure, online lessons, and exam-centre questions.",
            path: "/russian-gcse-private-candidate",
            keywords: [
              "Russian GCSE private candidate",
              "Russian GCSE exam centre",
              "GCSE Russian preparation",
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
          {
            label: "Private candidates",
            href: "/russian-gcse-private-candidate",
          },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="userCheck">
                Private candidate planning
              </Badge>
              <Badge tone="muted" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="speaking">
                Speaking logistics
              </Badge>
            </div>

            <Eyebrow>Russian GCSE private candidates</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Prepare for GCSE Russian while exam entry is arranged separately.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Private candidates need a learning route and a logistics plan. The course
              can structure lessons, vocabulary, grammar, and practice while the family
              confirms centre entry, tier choice, and speaking arrangements.
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
                Online lesson support
              </Button>
            </div>
          </div>

          <CandidatePlanVisual />
        </section>

        <FirstDecisionsSection />
        <PrepRouteSection />
        <CentreChecklistSection />
        <CandidateTypesSection />
        <CourseFitSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Give private-candidate preparation a clearer structure.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Start with trial access, inspect the course flow, and decide whether
                self-study or live support is the right next step for the student.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                View course
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
