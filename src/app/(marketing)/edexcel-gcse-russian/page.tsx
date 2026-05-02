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
  title: "Pearson Edexcel GCSE Russian Guide",
  description:
    "A clear guide to Pearson Edexcel GCSE Russian 1RU0, including the four papers, Foundation and Higher tiers, and how the course platform supports preparation.",
  path: "/edexcel-gcse-russian",
  ogTitle: "Pearson Edexcel GCSE Russian 1RU0",
  ogDescription:
    "Understand the four papers, Foundation and Higher tiers, speaking window, and course preparation.",
  ogImagePath: getOgImagePath("edexcel"),
  ogImageAlt: "Pearson Edexcel GCSE Russian 1RU0 guide",
});

type GuideItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type PaperItem = GuideItem & {
  paper: string;
  href: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const papers = [
  {
    paper: "Paper 1",
    title: "Listening",
    description:
      "Students listen for gist, detail, opinions, time markers, negatives, and familiar language in spoken Russian.",
    href: "/gcse-russian-listening-exam",
    icon: "listening",
  },
  {
    paper: "Paper 2",
    title: "Speaking",
    description:
      "Students prepare role play, picture-based discussion, and conversation, with confidence and pronunciation mattering early.",
    href: "/gcse-russian-speaking-exam",
    icon: "speaking",
  },
  {
    paper: "Paper 3",
    title: "Reading",
    description:
      "Students work on comprehension, inference, grammar clues, vocabulary recognition, and translation into English.",
    href: "/gcse-russian-reading-exam",
    icon: "lessonContent",
  },
  {
    paper: "Paper 4",
    title: "Writing",
    description:
      "Students write in Russian, translate into Russian, and use opinions, reasons, tenses, and topic vocabulary accurately.",
    href: "/gcse-russian-writing-exam",
    icon: "write",
  },
] satisfies PaperItem[];

const qualificationFacts = [
  {
    title: "Qualification code 1RU0",
    description:
      "The course and public guides are built around Pearson Edexcel GCSE Russian 1RU0 preparation.",
    icon: "school",
  },
  {
    title: "Four separate papers",
    description:
      "Listening, speaking, reading, and writing each need a different practice routine.",
    icon: "exam",
  },
  {
    title: "One tier route",
    description:
      "Foundation or Higher should be treated as a whole-route decision, not a paper-by-paper preference.",
    icon: "layers",
  },
] satisfies GuideItem[];

const tierNotes = [
  {
    title: "Foundation",
    description:
      "Focuses on secure core language, confidence, high-frequency vocabulary, and accessible exam tasks.",
    icon: "layers",
  },
  {
    title: "Higher",
    description:
      "Requires wider vocabulary, stronger grammar control, more developed answers, and less predictable language.",
    icon: "star",
  },
  {
    title: "Evidence before ambition",
    description:
      "Tier choice should be informed by practice evidence across skills, especially writing, translation, and listening.",
    icon: "completed",
  },
] satisfies GuideItem[];

const platformFit = [
  {
    title: "Public guides",
    description:
      "Explain the specification shape, paper differences, tier decisions, and parent/private-candidate questions.",
    icon: "info",
  },
  {
    title: "Course route",
    description:
      "Turns the qualification into lessons, vocabulary, grammar, paper practice, revision, and mock preparation.",
    icon: "courses",
  },
  {
    title: "Official resources",
    description:
      "Pearson remains the source for official qualification documents, papers, mark schemes, and administrative details.",
    icon: "externalLink",
  },
] satisfies GuideItem[];

const relatedLinks = [
  {
    title: "GCSE Russian exam guide",
    description: "Understand how the four papers shape revision and practice.",
    href: "/gcse-russian-exam-guide",
    icon: "exam" as const,
  },
  {
    title: "Online GCSE Russian course",
    description: "See how the course turns the specification into a study route.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "Foundation tier guide",
    description: "Plan core preparation and confidence-building.",
    href: "/gcse-russian-foundation-tier",
    icon: "layers" as const,
  },
  {
    title: "Higher tier guide",
    description: "Plan more demanding vocabulary, grammar, and output.",
    href: "/gcse-russian-higher-tier",
    icon: "star" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

const faqs: FaqItem[] = [
  {
    question: "Is GCSERussian.com an official Pearson Edexcel course?",
    answer:
      "No. It is an independent GCSE Russian course and public guide site built around Pearson Edexcel 1RU0 preparation.",
  },
  {
    question: "What is the GCSE Russian qualification code?",
    answer:
      "Pearson Edexcel GCSE Russian uses qualification code 1RU0. Families should always check Pearson's official qualification page for current documents and administrative details.",
  },
  {
    question: "Can students prepare for only one paper at a time?",
    answer:
      "Students can target one paper in practice, but the qualification needs preparation across listening, speaking, reading, and writing.",
  },
  {
    question: "How should tier choice be made?",
    answer:
      "Tier choice should be based on evidence from vocabulary, grammar, translation, listening, speaking, reading, and writing practice rather than confidence in one topic alone.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function EdexcelVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Pearson Edexcel</p>
            <p className="mt-1 text-xl font-bold">GCSE Russian 1RU0</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            4 papers
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {papers.map((paper) => (
          <Link
            key={paper.paper}
            href={paper.href}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--accent-ink)]">
                  {paper.paper}
                </p>
                <h3 className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                  {paper.title}
                </h3>
              </div>
              <AppIcon icon={paper.icon} size={18} className="text-[var(--accent-ink)]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FactSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Specification orientation</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            The qualification shape should guide the study plan.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            This page is for orientation: what the qualification is, which skills are
            assessed, and where the course fits alongside official Pearson information.
          </p>
        </div>
        <div className="grid gap-4">
          {qualificationFacts.map((item) => (
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

function PaperSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Four papers</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          GCSE Russian revision needs four different kinds of practice.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          A student can know a word and still lose marks if the paper skill is weak. The
          four paper pages go deeper into each task type.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {papers.map((paper) => (
          <Link
            key={paper.paper}
            href={paper.href}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:text-[var(--accent-ink)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-md bg-[var(--background-muted)] px-3 py-1 text-xs font-bold text-[var(--accent-ink)]">
                {paper.paper}
              </span>
              <AppIcon icon={paper.icon} size={21} className="text-[var(--accent-ink)]" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
              {paper.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {paper.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TierSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Foundation and Higher</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Tier choice should be tied to evidence from practice.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Foundation and Higher are not just labels. They change the difficulty,
            language range, and expectations across the student&apos;s preparation route.
          </p>
        </div>
        <div className="grid divide-y divide-[var(--border-subtle)]">
          {tierNotes.map((item) => (
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

function PlatformSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="grid gap-6 sm:grid-cols-3">
        {platformFit.map((item) => (
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
        <Eyebrow>Official vs course support</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Use official Pearson materials for rules. Use the course for study.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Families should check Pearson for official documents and administration. The
          platform&apos;s job is to help students turn the qualification into regular learning
          and practice.
        </p>
      </div>
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
            Turn orientation into a practical decision
          </h2>
        </div>
        <Button href="/gcse-russian-course" variant="secondary" icon="courses">
          View course
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
        <Eyebrow>Edexcel questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What families usually need clear
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

export default function EdexcelGcseRussianPage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "Pearson Edexcel GCSE Russian 1RU0 Guide",
            description:
              "A clear guide to Pearson Edexcel GCSE Russian 1RU0, including the four papers, Foundation and Higher tiers, and course preparation.",
            path: "/edexcel-gcse-russian",
            keywords: ["Pearson Edexcel GCSE Russian", "1RU0", "Edexcel Russian GCSE"],
            relatedLinks,
          }),
          buildFaqJsonLd(faqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
          { label: "Edexcel GCSE Russian", href: "/edexcel-gcse-russian" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Qualification code 1RU0
              </Badge>
              <Badge tone="muted" icon="exam">
                Four papers
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
            </div>

            <Eyebrow>Pearson Edexcel GCSE Russian</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Understand 1RU0 before choosing the study route.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              GCSE Russian preparation is easier when families understand the
              qualification shape: four papers, a Foundation or Higher route, and a study
              plan that connects language learning to exam tasks.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/gcse-russian-course" variant="primary" icon="courses">
                View course
              </Button>
              <Button href="/signup" variant="secondary" icon="create">
                Start trial
              </Button>
            </div>
          </div>

          <EdexcelVisual />
        </section>

        <FactSection />
        <PaperSection />
        <TierSection />
        <PlatformSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Turn the specification into a study plan.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create a trial account, explore the course structure, and use the app to
                practise the skills that matter for GCSE Russian.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="primary" icon="create">
                Create trial account
              </Button>
              <Button href="/gcse-russian-exam-guide" variant="secondary" icon="exam">
                Exam guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
