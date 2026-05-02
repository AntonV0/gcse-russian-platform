import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import JsonLd from "@/components/seo/json-ld";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildFaqJsonLd } from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Online Course",
  description:
    "A structured self-study GCSE Russian course for Pearson Edexcel 1RU0 students and families, with Foundation and Higher pathways, lessons, vocabulary, grammar, exam practice, and progress tracking.",
  path: "/marketing",
});

type FeatureItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type DetailFeatureItem = {
  title: string;
  detail: string;
  icon: AppIconKey;
};

type ProblemSolutionItem = {
  problem: string;
  solution: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const proofItems = [
  "Pearson Edexcel GCSE Russian 1RU0",
  "Foundation and Higher pathways",
  "Trial before checkout",
  "Built around Volna teaching workflows",
];

const problemSolutions = [
  {
    problem: "Revision becomes a pile of tabs, worksheets, and forgotten vocab lists.",
    solution: "The course gives students one route through lessons, practice, and review.",
    icon: "navigation",
  },
  {
    problem: "Grammar feels separate from the answers students need to write or translate.",
    solution: "Grammar is taught through examples, sentences, and exam-style tasks.",
    icon: "grammar",
  },
  {
    problem: "Parents want to help, but do not know what a sensible Russian plan looks like.",
    solution: "Progress and next steps make support at home calmer and more practical.",
    icon: "completed",
  },
] satisfies ProblemSolutionItem[];

const trialIncludes = [
  "Course structure preview",
  "Sample learning route",
  "Billing only after signup",
  "Foundation/Higher comparison",
];

const productHighlights = [
  {
    title: "Short sessions",
    description:
      "Lessons are designed for busy school weeks: clear enough to start after school, structured enough to return to later.",
    icon: "pending",
  },
  {
    title: "Real GCSE shape",
    description:
      "Vocabulary, grammar, speaking, reading, writing, translation, and mock preparation all connect back to Pearson Edexcel 1RU0.",
    icon: "exam",
  },
  {
    title: "Parent visibility",
    description:
      "The next useful step is easier to see, so support at home does not depend on guesswork.",
    icon: "users",
  },
] satisfies FeatureItem[];

const courseLayers = [
  { title: "Start", detail: "Exam overview and course orientation", icon: "school" },
  {
    title: "Foundations",
    detail: "High-frequency words and sentence building",
    icon: "brain",
  },
  {
    title: "Themes",
    detail: "Identity, school, travel, future plans, global issues",
    icon: "layers",
  },
  {
    title: "Skills",
    detail: "Listening, speaking, reading, writing, translation",
    icon: "exam",
  },
  {
    title: "Revision",
    detail: "Mixed practice, mocks, and weakness targeting",
    icon: "mockExam",
  },
] satisfies DetailFeatureItem[];

const lessonBlocks = [
  { title: "Teach", detail: "Clear explanation", icon: "note" },
  { title: "Practise", detail: "Vocab, grammar, questions", icon: "exercise" },
  { title: "Apply", detail: "Exam-style task", icon: "examTip" },
] satisfies DetailFeatureItem[];

const practiceSurfaces = [
  {
    title: "Vocabulary",
    description:
      "Required and extension words can sit inside lessons and topic revision.",
    icon: "vocabulary",
  },
  {
    title: "Grammar",
    description:
      "Patterns are practised in sentences, translations, and written answers.",
    icon: "grammar",
  },
  {
    title: "Questions",
    description: "Question sets support controlled practice before harder exam tasks.",
    icon: "questionSet",
  },
  {
    title: "Mocks",
    description:
      "Platform-created GCSE-style mocks stay separate from official Pearson links.",
    icon: "mockExam",
  },
] satisfies FeatureItem[];

const audiences = [
  {
    title: "Students",
    description:
      "Know what to do next after school, even when GCSE Russian feels hard to organise.",
    icon: "student",
  },
  {
    title: "Parents",
    description: "Support the routine without needing to teach Russian grammar yourself.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description:
      "Use a structured route while exam entry and speaking logistics are arranged separately.",
    icon: "userCheck",
  },
] satisfies FeatureItem[];

const faqs: FaqItem[] = [
  {
    question: "Is this an official Pearson Edexcel course?",
    answer:
      "No. It is an independent GCSE Russian course built around Pearson Edexcel 1RU0 preparation.",
  },
  {
    question: "Can students try it first?",
    answer:
      "Yes. Students can create a trial account and explore the learning environment before checkout.",
  },
  {
    question: "Does it replace a tutor?",
    answer:
      "It provides structure and practice. Some students may still benefit from live support for speaking, writing, or accountability.",
  },
  {
    question: "Are the mocks official papers?",
    answer:
      "No. Mock exams in the platform are GCSE-style practice. Official Pearson past paper links are kept separately.",
  },
];

const primaryLinks = [
  { href: "/gcse-russian-course", label: "Course" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gcse-russian-for-parents", label: "Parents" },
  { href: "/russian-gcse-private-candidate", label: "Private candidates" },
  { href: "/gcse-russian-exam-guide", label: "Exam guide" },
  { href: "/resources", label: "Resources" },
];

const guideLinks = [
  { href: "/edexcel-gcse-russian", label: "Edexcel guide" },
  { href: "/gcse-russian-revision", label: "Revision" },
  { href: "/gcse-russian-vocabulary", label: "Vocabulary" },
  { href: "/gcse-russian-grammar", label: "Grammar" },
  { href: "/online-gcse-russian-lessons", label: "Online lessons" },
  { href: "/gcse-russian-tutor", label: "Tutor guide" },
  { href: "/faq", label: "FAQ" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function ScreenshotShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background-muted)] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-fill)]" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function StudyDeskIllustration() {
  return (
    <div
      className="relative min-h-[210px] overflow-hidden rounded-lg border border-[var(--border-subtle)] [background:var(--accent-gradient-soft)] p-5 shadow-[var(--shadow-md)]"
      aria-label="Illustration of GCSE Russian study materials"
      role="img"
    >
      <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)] shadow-[var(--shadow-sm)]">
        <AppIcon icon="listening" size={26} />
      </div>
      <div className="absolute bottom-5 left-5 right-16 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
          GCSE Russian notes
        </p>
        <p className="mt-3 text-2xl font-extrabold leading-none text-[var(--text-primary)]">
          Я думаю...
        </p>
        <div className="mt-4 grid gap-2">
          <span className="h-2 w-3/4 rounded-full bg-[var(--background-muted)]" />
          <span className="h-2 w-1/2 rounded-full bg-[var(--background-muted)]" />
        </div>
      </div>
      <div className="absolute left-6 top-6 rounded-md bg-[var(--surface-elevated)] px-3 py-2 text-sm font-bold text-[var(--text-primary)] shadow-[var(--shadow-sm)]">
        1RU0
      </div>
      <div className="absolute bottom-10 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-fill)] text-[var(--accent-on-fill)] shadow-[var(--shadow-md)]">
        <AppIcon icon="pencil" size={22} />
      </div>
    </div>
  );
}

function HeroProductVisual() {
  return (
    <div className="relative grid gap-4">
      <StudyDeskIllustration />
      <ScreenshotShell title="Student dashboard" className="relative z-10">
        <div className="space-y-4 p-4">
          <div className="rounded-lg marketing-dark-panel p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs opacity-70">Next step</p>
                <p className="mt-1 text-lg font-bold">Present tense essentials</p>
              </div>
              <span className="rounded-md bg-[var(--accent-fill)] px-2.5 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
                Step 3 of 6
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background)]/20">
              <div className="h-full w-[58%] rounded-full bg-[var(--accent-fill)]" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="text-xs font-semibold text-[var(--text-muted)]">Course</p>
              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                Foundation pathway
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] p-3">
              <p className="text-xs font-semibold text-[var(--text-muted)]">Practice</p>
              <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">
                12 questions ready
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--background-muted)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Today&apos;s route
              </p>
              <AppIcon icon="learning" size={17} className="text-[var(--accent-ink)]" />
            </div>
            {["Vocabulary warm-up", "Grammar in use", "Reading task"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 border-t border-[var(--border-subtle)] py-2 first:border-t-0"
              >
                <AppIcon icon="confirm" size={14} className="text-[var(--accent-ink)]" />
                <span className="text-sm text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </ScreenshotShell>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]">
          <AppIcon icon="vocabulary" size={18} className="text-[var(--accent-ink)]" />
          <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
            Theme vocabulary
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]">
          <AppIcon icon="mockExam" size={18} className="text-[var(--accent-ink)]" />
          <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
            Mock practice
          </p>
        </div>
      </div>
    </div>
  );
}

function CourseMapVisual() {
  return (
    <div className="relative grid gap-3">
      <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
      {courseLayers.map((layer, index) => (
        <div
          key={layer.title}
          className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-sm)]"
        >
          <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)] ring-4 ring-[var(--background-muted)]">
            <AppIcon icon={layer.icon} size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--accent-ink)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {layer.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
              {layer.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LessonVisual() {
  return (
    <ScreenshotShell title="Lesson section">
      <div className="grid gap-0 md:grid-cols-[1fr_220px]">
        <div className="space-y-4 p-4">
          <div className="rounded-lg bg-[var(--background-muted)] p-4">
            <p className="text-xs font-bold text-[var(--accent-ink)]">Current section</p>
            <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              Opinions and reasons
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Build a simple opinion, add a reason, then use it in a GCSE-style answer.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {lessonBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-lg border border-[var(--border-subtle)] p-3"
              >
                <AppIcon
                  icon={block.icon}
                  size={17}
                  className="text-[var(--accent-ink)]"
                />
                <p className="mt-2 text-sm font-bold text-[var(--text-primary)]">
                  {block.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {block.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] p-4">
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Я думаю, что русский полезный, потому что...
            </p>
            <div className="mt-3 h-2 w-2/3 rounded-full bg-[var(--accent-fill)]" />
          </div>
        </div>

        <aside className="border-t border-[var(--border-subtle)] bg-[var(--background-muted)] p-4 md:border-l md:border-t-0">
          <p className="text-xs font-bold text-[var(--text-muted)]">Steps</p>
          {["Intro", "Core teaching", "Guided practice", "Exam practice"].map(
            (step, index) => (
              <div
                key={step}
                className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    index < 2
                      ? "bg-[var(--accent-fill)] text-[var(--accent-on-fill)]"
                      : "bg-[var(--surface-elevated)] text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                {step}
              </div>
            )
          )}
        </aside>
      </div>
    </ScreenshotShell>
  );
}

function PracticeVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {practiceSurfaces.map((surface) => (
        <div
          key={surface.title}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
        >
          <div className="mb-6 flex items-center justify-between">
            <AppIcon
              icon={surface.icon}
              size={20}
              className="text-[var(--accent-ink)]"
            />
            <span className="h-2 w-16 rounded-full bg-[var(--background-muted)]" />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {surface.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {surface.description}
          </p>
        </div>
      ))}
    </div>
  );
}

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
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
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
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
                The course is built for the moments where GCSE Russian usually unravels.
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {problemSolutions.map((item) => (
                <div key={item.problem} className="grid gap-4 py-5 sm:grid-cols-[2.5rem_1fr]">
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
            <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
              Trial access
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">
              Try the learning environment before choosing a plan.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trialIncludes.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
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
              <h2 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
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
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-5xl">
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
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
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
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
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
              <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
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

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
              Before you start
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

        <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Explore the site</Eyebrow>
              <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
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
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Try the course before deciding.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                Create a trial account, explore the course structure, and upgrade inside
                the app if it feels right for the student.
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
