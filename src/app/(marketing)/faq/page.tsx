import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd } from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Course FAQ",
  description:
    "Answers to common questions about the GCSE Russian course, Pearson Edexcel 1RU0 preparation, trial access, pricing, private candidates, and online lessons.",
  path: "/faq",
  ogTitle: "GCSE Russian Course FAQ",
  ogDescription:
    "Clear answers about course access, trial accounts, pricing, papers, tiers, parents, and private candidates.",
  ogImagePath: getOgImagePath("faq"),
  ogImageAlt: "GCSE Russian course FAQ",
});

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  title: string;
  description: string;
  icon: AppIconKey;
  items: FaqItem[];
};

const faqGroups = [
  {
    title: "Course and trial access",
    description:
      "Questions about starting, exploring the course, and how the platform is organised.",
    icon: "courses",
    items: [
      {
        question: "Can students try the course before paying?",
        answer:
          "Yes. Students can create a trial account, inspect the learning environment, and upgrade later from inside the signed-in app.",
      },
      {
        question: "Is this an official Pearson Edexcel course?",
        answer:
          "No. GCSERussian.com is an independent GCSE Russian course platform built around Pearson Edexcel 1RU0 preparation.",
      },
      {
        question: "What does the course include?",
        answer:
          "The course route connects lessons, vocabulary, grammar, exam-style practice, revision, mock preparation, and progress visibility.",
      },
    ],
  },
  {
    title: "Exams and tiers",
    description:
      "Questions about Pearson Edexcel 1RU0, Foundation/Higher, and the four papers.",
    icon: "exam",
    items: [
      {
        question: "Which exam board is the course built around?",
        answer:
          "The course and public guides are built around Pearson Edexcel GCSE Russian 1RU0.",
      },
      {
        question: "How should families choose Foundation or Higher?",
        answer:
          "Tier choice should be based on evidence from vocabulary, grammar, translation, and paper-style practice, not only ambition or confidence in one topic.",
      },
      {
        question: "Do students need to prepare all four papers?",
        answer:
          "Yes. Listening, speaking, reading, and writing each need specific practice habits, even though vocabulary and grammar support all four.",
      },
    ],
  },
  {
    title: "Pricing and support",
    description:
      "Questions about checkout, online lessons, and whether live support is needed.",
    icon: "pricing",
    items: [
      {
        question: "Where does checkout happen?",
        answer:
          "Checkout happens securely from inside the signed-in app so course access is attached to the correct student account.",
      },
      {
        question: "Are online lessons included in course pricing?",
        answer:
          "Course access and live teaching support are separate decisions. Some students can self-study; others benefit from online lessons for speaking, writing, or accountability.",
      },
      {
        question: "Does the course replace a tutor?",
        answer:
          "It provides structure and practice. Some students may still benefit from live support for speaking, writing feedback, grammar explanation, or accountability.",
      },
    ],
  },
  {
    title: "Parents and private candidates",
    description:
      "Questions about family support, private entry, and exam-centre responsibilities.",
    icon: "users",
    items: [
      {
        question: "Do parents need to know Russian to help?",
        answer:
          "No. Parents can support the routine, ask about weak papers, protect study time, and arrange extra support when needed.",
      },
      {
        question: "Can the platform enter a student for GCSE Russian?",
        answer:
          "No. Families arranging private entry must confirm exam entry, fees, deadlines, and speaking arrangements directly with an exam centre.",
      },
      {
        question: "Is the course useful for private candidates?",
        answer:
          "Yes. The course can provide structured preparation while exam entry and speaking arrangements are handled separately.",
      },
    ],
  },
] satisfies FaqGroup[];

const allFaqs = faqGroups.flatMap((group) => group.items);

const relatedLinks = [
  {
    title: "Course",
    description: "See the structured GCSE Russian route.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Pricing",
    description: "Compare Foundation and Higher access.",
    href: "/pricing",
    icon: "pricing" as const,
  },
  {
    title: "Parents",
    description: "Understand how families can support revision.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "Private candidates",
    description: "Plan course preparation and exam-centre logistics.",
    href: "/russian-gcse-private-candidate",
    icon: "userCheck" as const,
  },
] satisfies Array<{ title: string; description: string; href: string; icon: AppIconKey }>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function FaqHeroVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">FAQ</p>
            <p className="mt-1 text-xl font-bold">Answers by decision area</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon="help" size={24} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {faqGroups.map((group) => (
          <div
            key={group.title}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon={group.icon} size={19} />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{group.title}</p>
            <span className="rounded-md bg-[var(--surface-elevated)] px-2 py-1 text-xs font-bold text-[var(--text-secondary)]">
              {group.items.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqGroupsSection() {
  return (
    <section className="space-y-6">
      {faqGroups.map((group) => (
        <div key={group.title} className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
          <div className="grid gap-6 border-b border-[var(--border-subtle)] pb-6 lg:grid-cols-[0.42fr_1fr] lg:items-end">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)] shadow-[var(--shadow-sm)]">
                <AppIcon icon={group.icon} size={21} />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-[var(--text-primary)]">
                {group.title}
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
              {group.description}
            </p>
          </div>
          <div className="mt-6 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {group.items.map((item) => (
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
        </div>
      ))}
    </section>
  );
}

function RelatedLinksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Still deciding? Start with these.
          </h2>
        </div>
        <Button href="/resources" variant="secondary" icon="lessonContent">
          View resources
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

export default function MarketingFaqPage() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(allFaqs)} />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "FAQ", href: "/faq" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="help">
                Course questions
              </Badge>
              <Badge tone="muted" icon="pricing">
                Pricing and trial
              </Badge>
              <Badge tone="muted" icon="exam">
                Exam and tiers
              </Badge>
            </div>

            <Eyebrow>FAQ</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Clear answers before choosing the route.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              These answers cover the main decisions families usually need to settle:
              course access, Pearson Edexcel 1RU0, Foundation/Higher, pricing, support,
              parents, and private-candidate planning.
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

          <FaqHeroVisual />
        </section>

        <FaqGroupsSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                The simplest next step is a trial account.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Students can inspect the course structure before the family chooses paid
                access or extra live support.
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
