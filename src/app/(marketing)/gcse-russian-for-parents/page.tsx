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
  title: "GCSE Russian for Parents",
  description:
    "A calm parent guide to GCSE Russian, Pearson Edexcel 1RU0 preparation, course structure, progress visibility, online lessons, and private-candidate planning.",
  path: "/gcse-russian-for-parents",
  ogTitle: "GCSE Russian for Parents",
  ogDescription:
    "Understand GCSE Russian support, course structure, progress visibility, and when extra help is useful.",
  ogImagePath: getOgImagePath("parents"),
  ogImageAlt: "GCSE Russian guide for parents",
});

type ParentItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type ParentCheckItem = {
  question: string;
  usefulSignal: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const parentConcerns = [
  {
    title: "Is there a real route?",
    description:
      "Parents need to know the student is not bouncing between random videos, worksheets, and past papers.",
    icon: "navigation",
  },
  {
    title: "What should happen each week?",
    description:
      "A sustainable plan needs short study blocks for vocabulary, grammar, lessons, and exam-style practice.",
    icon: "calendar",
  },
  {
    title: "Where is extra support needed?",
    description:
      "Speaking, writing, accountability, and private-candidate logistics often need more adult or teacher input.",
    icon: "users",
  },
] satisfies ParentItem[];

const parentSupport = [
  {
    title: "Protect the routine",
    description:
      "Help the student keep two or three short Russian sessions visible during the week, even when school is busy.",
    icon: "calendar",
  },
  {
    title: "Ask better questions",
    description:
      "Instead of checking every answer, ask which paper feels weakest and what the next small step is.",
    icon: "question",
  },
  {
    title: "Separate learning from logistics",
    description:
      "Course preparation, tier choice, exam-centre entry, and speaking arrangements are related, but not the same job.",
    icon: "layers",
  },
] satisfies ParentItem[];

const monthlyChecks = [
  {
    question: "Has the student studied across all four papers?",
    usefulSignal:
      "Listening, speaking, reading, and writing have all appeared in recent practice.",
    icon: "exam",
  },
  {
    question: "Is vocabulary becoming reusable?",
    usefulSignal:
      "Words from lessons are turning up again in revision, answers, and translation tasks.",
    icon: "vocabulary",
  },
  {
    question: "Does grammar show up in output?",
    usefulSignal:
      "Tenses, opinions, reasons, and sentence patterns are being used in writing or speaking.",
    icon: "grammar",
  },
  {
    question: "Is there a clear next step?",
    usefulSignal:
      "The student can say what they are doing next without rebuilding the plan from scratch.",
    icon: "completed",
  },
] satisfies ParentCheckItem[];

const decisionRoutes = [
  {
    title: "Self-study course",
    description:
      "Best when the student needs structure, short lessons, practice, and a visible route through Pearson Edexcel 1RU0.",
    icon: "courses",
  },
  {
    title: "Online lesson support",
    description:
      "Useful when speaking, writing feedback, grammar explanation, or accountability needs a teacher-led rhythm.",
    icon: "teacher",
  },
  {
    title: "Private-candidate planning",
    description:
      "Important when the family must arrange exam entry, centre deadlines, tier decisions, and speaking logistics.",
    icon: "userCheck",
  },
] satisfies ParentItem[];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "See how the course gives students a structured self-study route.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "GCSE Russian exam guide",
    description: "Understand the four papers and how revision should be planned.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Russian GCSE private candidates",
    description: "Separate exam-centre logistics from course preparation.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
  {
    title: "GCSE Russian tutor guide",
    description: "Compare self-study, online lessons, and tutor-style support.",
    href: "/gcse-russian-tutor",
    icon: "teacher" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

const faqs: FaqItem[] = [
  {
    question: "Do parents need to know Russian to help?",
    answer:
      "No. Parents can still support the routine, ask about weak papers, protect study time, and arrange extra speaking or writing support when needed.",
  },
  {
    question: "What should parents check first?",
    answer:
      "Start with the exam board, tier route, weekly routine, and whether the student has a plan for all four papers: listening, speaking, reading, and writing.",
  },
  {
    question: "When is online lesson support useful?",
    answer:
      "Online support is most useful when the student needs speaking practice, writing feedback, grammar explanation, or external accountability.",
  },
  {
    question: "What if the student is a private candidate?",
    answer:
      "Preparation can happen through the course, but families should confirm exam entry, fees, deadlines, tier, and speaking arrangements directly with an exam centre.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function ParentRouteVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Parent view</p>
            <p className="mt-1 text-xl font-bold">This week has a shape</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            Calm plan
          </span>
        </div>
        <div className="mt-4 grid gap-2">
          {["Lesson route", "Vocabulary review", "Paper practice"].map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <span
                className={[
                  "h-2 rounded-full",
                  index === 0
                    ? "w-3/4 bg-[var(--accent-fill)]"
                    : index === 1
                      ? "w-1/2 bg-[var(--background)]/45"
                      : "w-2/3 bg-[var(--background)]/25",
                ].join(" ")}
              />
              <span className="text-xs font-semibold opacity-80">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Next action", "Present tense essentials", "grammar"],
          ["Weak paper", "Speaking needs repetition", "speaking"],
          ["Parent role", "Check routine, not every answer", "users"],
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

function ConcernSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.52fr_1fr] lg:items-start">
        <div>
          <Eyebrow>What parents are really trying to work out</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            The hard part is not caring. It is knowing what help is actually useful.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            GCSE Russian can feel unusually opaque for families: fewer school resources,
            unfamiliar exam logistics, and a language parents may not speak themselves.
          </p>
        </div>

        <div className="grid gap-4">
          {parentConcerns.map((item) => (
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

function SupportSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.46fr] lg:items-center">
      <div className="grid gap-6 sm:grid-cols-3">
        {parentSupport.map((item) => (
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
        <Eyebrow>How to help without taking over</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Parents do not need to become the Russian teacher.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The useful parent role is lighter and steadier: make the routine visible,
          notice when a paper is being avoided, and add support when the student needs
          feedback rather than more resources.
        </p>
      </div>
    </section>
  );
}

function MonthlyCheckSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Monthly check-in</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            A good parent check-in should reduce pressure, not create a lecture.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            The aim is to spot drift early: missing papers, weak vocabulary, grammar that
            never reaches output, or a plan that has become vague.
          </p>
        </div>

        <div className="grid divide-y divide-[var(--border-subtle)]">
          {monthlyChecks.map((item) => (
            <div key={item.question} className="grid gap-4 p-5 sm:grid-cols-[2.5rem_1fr]">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {item.question}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.usefulSignal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecisionSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Support decisions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Choose support based on the actual problem.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          More resources are not always the answer. Some students need a route; some need
          feedback; some families need logistics handled early.
        </p>
      </div>

      <div className="grid gap-3">
        {decisionRoutes.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
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
            Keep parent decisions separate and clear
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
        <Eyebrow>Parent questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What parents usually need settled
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

export default function GcseRussianForParentsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "GCSE Russian Guide for Parents",
            description:
              "A parent-friendly guide to GCSE Russian preparation, course structure, progress visibility, online lessons, and private-candidate planning.",
            path: "/gcse-russian-for-parents",
            keywords: [
              "GCSE Russian for parents",
              "Russian GCSE course for child",
              "GCSE Russian online course parents",
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
          { label: "Parents", href: "/gcse-russian-for-parents" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="users">
                Parent support
              </Badge>
              <Badge tone="muted" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="success" icon="unlocked">
                Trial-first access
              </Badge>
            </div>

            <Eyebrow>GCSE Russian for parents</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Help your child prepare without having to manage every lesson.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              GCSE Russian is easier to support when the route is visible: what the exam
              involves, what the student should practise next, and when extra speaking,
              writing, or private-candidate help is worth adding.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href="/gcse-russian-course" variant="secondary" icon="courses">
                View course
              </Button>
            </div>
          </div>

          <ParentRouteVisual />
        </section>

        <ConcernSection />
        <SupportSection />
        <MonthlyCheckSection />
        <DecisionSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Start with a low-pressure look inside the course.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                A trial account lets the family inspect the course structure before
                deciding whether self-study, online lesson support, or a blended route
                makes most sense.
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
