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
  title: "GCSE Russian Exam Guide",
  description:
    "A practical GCSE Russian exam guide for Pearson Edexcel 1RU0 students and parents, covering the four papers, tiers, revision priorities, and structured practice.",
  path: "/gcse-russian-exam-guide",
  ogTitle: "GCSE Russian Exam Guide",
  ogDescription:
    "Understand the four papers, tier choice, revision priorities, and how structured practice supports GCSE Russian preparation.",
  ogImagePath: getOgImagePath("exam-guide"),
  ogImageAlt: "GCSE Russian exam guide",
});

type ExamPaper = {
  paper: string;
  title: string;
  description: string;
  studentFocus: string;
  parentCheck: string;
  href: string;
  icon: AppIconKey;
};

type GuideItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const examPapers = [
  {
    paper: "Paper 1",
    title: "Listening",
    description:
      "Students listen for gist, detail, opinions, time markers, negatives, and familiar vocabulary in spoken Russian.",
    studentFocus: "Hear the language often enough that topic words and question types stop feeling new.",
    parentCheck: "Is listening practice happening regularly, not just near the exam?",
    href: "/gcse-russian-listening-exam",
    icon: "listening",
  },
  {
    paper: "Paper 2",
    title: "Speaking",
    description:
      "Students prepare for role play, picture-based discussion, and conversation across GCSE themes.",
    studentFocus: "Build answer patterns, pronunciation confidence, and the habit of extending ideas.",
    parentCheck: "Has speaking been planned early enough for live practice or feedback?",
    href: "/gcse-russian-speaking-exam",
    icon: "speaking",
  },
  {
    paper: "Paper 3",
    title: "Reading",
    description:
      "Students read short and longer texts, infer meaning, recognise grammar in context, and translate into English.",
    studentFocus: "Practise reading for meaning instead of translating every word in order.",
    parentCheck: "Can the student explain why an answer is right, not only guess from keywords?",
    href: "/gcse-russian-reading-exam",
    icon: "lessonContent",
  },
  {
    paper: "Paper 4",
    title: "Writing",
    description:
      "Students write in Russian, translate into Russian, and use opinions, reasons, tenses, and topic vocabulary accurately.",
    studentFocus: "Turn grammar and vocabulary into controlled answers under exam-style pressure.",
    parentCheck: "Is writing being corrected, reviewed, and rewritten over time?",
    href: "/gcse-russian-writing-exam",
    icon: "write",
  },
] satisfies ExamPaper[];

const revisionSequence = [
  {
    title: "Understand the exam shape",
    description:
      "Know the four papers, the tier route, and which skills need the most attention before building a weekly plan.",
    icon: "exam",
  },
  {
    title: "Secure reusable language",
    description:
      "Vocabulary, sentence patterns, tenses, opinions, and reasons support every paper, not only writing.",
    icon: "vocabulary",
  },
  {
    title: "Practise paper behaviour",
    description:
      "Students need repeated contact with listening, speaking, reading, writing, and translation-style tasks.",
    icon: "questionSet",
  },
  {
    title: "Review the weak points",
    description:
      "Mock-style practice is useful only when mistakes feed back into vocabulary, grammar, and paper-specific routines.",
    icon: "completed",
  },
] satisfies GuideItem[];

const tierChoices = [
  {
    title: "Foundation",
    description:
      "Best when the priority is confidence, high-frequency language, secure comprehension, and controlled answers.",
    icon: "layers",
  },
  {
    title: "Higher",
    description:
      "Best when the student is ready for wider vocabulary, more complex grammar, longer answers, and harder papers.",
    icon: "star",
  },
  {
    title: "Decision point",
    description:
      "Tier choice should be connected to evidence from practice, not only ambition or a single strong topic.",
    icon: "completed",
  },
] satisfies GuideItem[];

const appFit = [
  {
    title: "Public guide",
    description:
      "Explains papers, tiers, and planning decisions so families know what they are looking at.",
    icon: "info",
  },
  {
    title: "Course route",
    description:
      "Turns the exam overview into lessons, vocabulary, grammar, and structured practice.",
    icon: "courses",
  },
  {
    title: "Practice surfaces",
    description:
      "Keeps question sets, mock preparation, past-paper links, and revision routines in clearer places.",
    icon: "surfaces",
  },
] satisfies GuideItem[];

const relatedLinks = [
  {
    title: "Pearson Edexcel GCSE Russian",
    description: "Understand qualification code 1RU0, papers, tiers, and official context.",
    href: "/edexcel-gcse-russian",
    icon: "school" as const,
  },
  {
    title: "GCSE Russian revision guide",
    description: "Turn the exam overview into a practical weekly revision routine.",
    href: "/gcse-russian-revision",
    icon: "calendar" as const,
  },
  {
    title: "GCSE Russian past papers",
    description: "Use official resource links and mock preparation more deliberately.",
    href: "/gcse-russian-past-papers",
    icon: "pastPapers" as const,
  },
  {
    title: "Foundation tier",
    description: "Plan a route built around core confidence and accessible exam tasks.",
    href: "/gcse-russian-foundation-tier",
    icon: "layers" as const,
  },
  {
    title: "Higher tier",
    description: "Plan preparation for wider range, accuracy, and more demanding tasks.",
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
    question: "Which exam board is this guide for?",
    answer:
      "This guide is written for Pearson Edexcel GCSE Russian 1RU0 preparation. It is independent guidance, not an official Pearson product or endorsement.",
  },
  {
    question: "Should students revise papers separately?",
    answer:
      "They should understand each paper separately, but vocabulary and grammar should be revised as reusable language across listening, speaking, reading, and writing.",
  },
  {
    question: "When should speaking preparation start?",
    answer:
      "Speaking should start early because confidence, pronunciation, answer patterns, and feedback need repetition. It is usually the hardest paper to fix with last-minute revision.",
  },
  {
    question: "Where do past papers fit?",
    answer:
      "Past papers are best used after students understand the task types and have enough vocabulary and grammar to learn from mistakes. Platform-created mocks and official Pearson links should stay clearly separate.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function ExamRouteVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">GCSE Russian route</p>
            <p className="mt-1 text-xl font-bold">Four papers, one study plan</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            1RU0
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background)]/20">
          <div className="h-full w-[68%] rounded-full bg-[var(--accent-fill)]" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {examPapers.map((paper) => (
          <Link
            key={paper.paper}
            href={paper.href}
            className="group rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--accent-ink)]">
                  {paper.paper}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--text-primary)]">
                  {paper.title}
                </h3>
              </div>
              <AppIcon
                icon={paper.icon}
                size={20}
                className="text-[var(--accent-ink)]"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {paper.studentFocus}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PaperGuideSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.45fr_1fr] lg:items-start">
        <div>
          <Eyebrow>The four papers</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Each paper needs a different kind of practice.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            Students often say they are revising Russian, but the exam asks them to do
            four different things with the language. A good plan makes those differences
            obvious.
          </p>
        </div>

        <div className="grid gap-4">
          {examPapers.map((paper) => (
            <article
              key={paper.paper}
              className="grid gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)] md:grid-cols-[3rem_minmax(0,1fr)_minmax(180px,0.45fr)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={paper.icon} size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
                  {paper.paper}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                  {paper.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {paper.description}
                </p>
              </div>
              <div className="rounded-md border border-[var(--border-subtle)] p-3">
                <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
                  Parent check
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {paper.parentCheck}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevisionSequenceSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="relative grid gap-4">
        <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
        {revisionSequence.map((item, index) => (
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
        <Eyebrow>Revision sequence</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Exam preparation works best when practice has an order.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Past papers and mocks matter, but they are more useful after students have
          enough language and task familiarity to learn from the mistakes they make.
        </p>
      </div>
    </section>
  );
}

function TierSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Tier choice</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Foundation or Higher should be a planning decision, not a guess.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            The tier route affects what students practise, how ambitious answers should
            become, and how families interpret mock-style performance.
          </p>
        </div>

        <div className="grid divide-y divide-[var(--border-subtle)]">
          {tierChoices.map((item) => (
            <div key={item.title} className="flex gap-4 p-5 sm:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
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

function AppFitSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Where the app fits</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          The guide explains the exam. The course builds the routine.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          This page should help families orient themselves quickly. The logged-in
          experience is where students see lessons, practice, revision, and progress in
          one place.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {appFit.map((item) => (
          <div
            key={item.title}
            className="border-t-2 border-[var(--accent-fill)] pt-5"
          >
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
          <Eyebrow>Next decisions</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Go deeper without rereading the same overview
          </h2>
        </div>
        <Button href="/gcse-russian-course" variant="secondary" icon="courses">
          View course
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
        <Eyebrow>Exam questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What families usually need clear before revising
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

export default function GcseRussianExamGuidePage() {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: "GCSE Russian Exam Guide",
            description:
              "A practical GCSE Russian exam guide covering listening, speaking, reading, writing, Foundation and Higher tiers, and structured preparation.",
            path: "/gcse-russian-exam-guide",
            keywords: [
              "GCSE Russian exam",
              "Edexcel Russian GCSE",
              "Russian GCSE revision",
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
          { label: "Exam guide", href: "/gcse-russian-exam-guide" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="exam">
                Four papers
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
              <Badge tone="muted" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
            </div>

            <Eyebrow>GCSE Russian exam guide</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Understand the papers before building the revision plan.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              GCSE Russian preparation is easier to manage when students and parents can
              see what each paper asks for, how tier choice changes the route, and where
              structured practice fits.
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

          <ExamRouteVisual />
        </section>

        <PaperGuideSection />
        <RevisionSequenceSection />
        <TierSection />
        <AppFitSection />
        <FaqSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Turn the exam overview into a study routine.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create a trial account, inspect the course structure, and see how lessons,
                vocabulary, grammar, and exam practice fit together.
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
