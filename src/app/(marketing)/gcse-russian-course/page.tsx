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
import type { AppIconKey } from "@/lib/shared/icons";

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

type FeatureItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type FaqItem = {
  question: string;
  answer: string;
};

const courseLayers = [
  {
    title: "Start here",
    time: "2-3 hours",
    description: "Orientation, exam overview, and Foundation vs Higher explained.",
    icon: "school",
  },
  {
    title: "Core foundations",
    time: "10-15 hours",
    description: "High-frequency vocabulary, sentence building, present tense, opinions.",
    icon: "brain",
  },
  {
    title: "GCSE themes",
    time: "50-60 hours",
    description: "Identity, travel, school, future plans, and global issues.",
    icon: "layers",
  },
  {
    title: "Skill training",
    time: "15-20 hours",
    description: "Listening, speaking, reading, writing, and translation technique.",
    icon: "exam",
  },
  {
    title: "Revision and mocks",
    time: "15-20 hours",
    description: "Mixed practice, paper practice, mock exams, and weakness targeting.",
    icon: "mockExam",
  },
] satisfies FeatureItem[] &
  Array<{ time: string }>;

const lessonFlow = [
  {
    title: "Learn",
    description: "Explanations, notes, vocabulary, examples, and exam tips.",
    icon: "lessonContent",
  },
  {
    title: "Practise",
    description: "Controlled exercises, sentence building, gap fills, and question sets.",
    icon: "exercise",
  },
  {
    title: "Apply",
    description: "Reading, listening, writing, speaking, and translation-style tasks.",
    icon: "examTip",
  },
] satisfies FeatureItem[];

const courseIncludes = [
  {
    title: "Variant-aware lessons",
    description: "Shared teaching can sit alongside Foundation-only and Higher-only sections.",
    icon: "layers",
  },
  {
    title: "Vocabulary that returns",
    description: "Words introduced in lessons can reappear in revision and practice tools.",
    icon: "vocabulary",
  },
  {
    title: "Grammar with output",
    description: "Patterns are practised through examples, translations, and written answers.",
    icon: "grammar",
  },
  {
    title: "Question-set practice",
    description: "Controlled practice prepares students before they meet harder exam tasks.",
    icon: "questionSet",
  },
  {
    title: "Mock preparation",
    description: "Platform-created GCSE-style mocks sit separately from official Pearson links.",
    icon: "mockExam",
  },
  {
    title: "Progress visibility",
    description: "Students can return to the next useful step and revisit earlier sections.",
    icon: "completed",
  },
] satisfies FeatureItem[];

const tierComparison = [
  {
    label: "Shared course core",
    foundation: "Secure the high-frequency language and GCSE routines that every student needs.",
    higher: "Use the same core as a launchpad before moving into harder sentence patterns.",
    icon: "layers",
  },
  {
    label: "Difficulty control",
    foundation: "Focus on accessible output, reliable comprehension, and confidence with common tasks.",
    higher: "Unlock extra challenge, fuller answers, richer grammar, and more demanding practice.",
    icon: "settings",
  },
  {
    label: "Revision route",
    foundation: "Revisit essentials without being buried under extension work.",
    higher: "Target weaknesses while keeping higher-tier vocabulary and paper demands visible.",
    icon: "completed",
  },
] satisfies Array<{
  label: string;
  foundation: string;
  higher: string;
  icon: AppIconKey;
}>;

const examPapers = [
  {
    paper: "Paper 1",
    title: "Listening",
    description: "Audio-led comprehension practice, topic vocabulary, and question handling.",
    icon: "listening",
  },
  {
    paper: "Paper 2",
    title: "Speaking",
    description: "Role play, picture-based discussion, conversation themes, and answer building.",
    icon: "speaking",
  },
  {
    paper: "Paper 3",
    title: "Reading",
    description: "Short texts, inference, translation into English, and paper-style questions.",
    icon: "lessonContent",
  },
  {
    paper: "Paper 4",
    title: "Writing",
    description: "Sentence control, translation into Russian, opinions, reasons, and longer answers.",
    icon: "write",
  },
] satisfies FeatureItem[] &
  Array<{ paper: string }>;

const publicAppSplit = [
  {
    title: "Public guide pages",
    description:
      "Useful for families comparing tiers, exam papers, private-candidate logistics, and revision decisions.",
    icon: "pastPapers",
  },
  {
    title: "Trial course access",
    description:
      "Useful when the student needs to see the learning route, sample lessons, practice surfaces, and dashboard flow.",
    icon: "unlocked",
  },
  {
    title: "Paid course routine",
    description:
      "Useful once weekly study, revision, mock preparation, and optional live support need to become repeatable.",
    icon: "calendar",
  },
] satisfies FeatureItem[];

const audiences = [
  {
    title: "Self-study students",
    description: "A clear route through the course when school support is limited or uneven.",
    icon: "student",
  },
  {
    title: "Parents",
    description: "Enough structure to understand the plan without becoming the Russian teacher.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description: "Course preparation can run alongside separate exam-entry arrangements.",
    icon: "userCheck",
  },
  {
    title: "Volna learners",
    description: "The same platform can support teacher-led assignments and feedback workflows.",
    icon: "teacher",
  },
] satisfies FeatureItem[];

const faqs: FaqItem[] = [
  {
    question: "Is the course only for Pearson Edexcel GCSE Russian?",
    answer:
      "The course is designed around Pearson Edexcel GCSE Russian 1RU0. It is not an official Pearson product or endorsement.",
  },
  {
    question: "Is the full course self-study?",
    answer:
      "The main course is built for self-study, with optional live support through Volna-style teacher workflows where needed.",
  },
  {
    question: "How do Foundation and Higher work?",
    answer:
      "Some content can be shared, while harder sections can be shown only to Higher students and core sections can be targeted to Foundation students.",
  },
  {
    question: "Can private candidates use it?",
    answer:
      "Yes. The course can support preparation, but exam entry, speaking arrangements, and deadlines still need to be organised with an exam centre.",
  },
];

const relatedLinks = [
  { href: "/edexcel-gcse-russian", label: "Edexcel guide", icon: "school" },
  { href: "/gcse-russian-exam-guide", label: "Exam guide", icon: "exam" },
  { href: "/gcse-russian-foundation-tier", label: "Foundation tier", icon: "layers" },
  { href: "/gcse-russian-higher-tier", label: "Higher tier", icon: "star" },
  { href: "/russian-gcse-private-candidate", label: "Private candidates", icon: "userCheck" },
] satisfies Array<{ href: string; label: string; icon: AppIconKey }>;

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

function CourseArchitectureVisual() {
  return (
    <ScreenshotShell title="Course structure">
      <div className="space-y-4 p-4">
        <div className="rounded-lg marketing-dark-panel p-4">
          <p className="text-xs opacity-70">GCSE Russian</p>
          <p className="mt-1 text-xl font-bold">Foundation and Higher pathways</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="rounded-md bg-[var(--background)]/10 px-3 py-2 text-sm">
              Foundation
            </span>
            <span className="rounded-md bg-[var(--accent-fill)] px-3 py-2 text-sm font-bold text-[var(--accent-on-fill)]">
              Higher
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          {["Course", "Variant", "Module", "Lesson", "Section", "Block"].map(
            (item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--background-muted)] text-xs font-bold text-[var(--accent-ink)]">
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{item}</span>
                {index < 5 ? (
                  <AppIcon icon="down" size={14} className="text-[var(--text-muted)]" />
                ) : (
                  <AppIcon icon="completed" size={14} className="text-[var(--accent-ink)]" />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </ScreenshotShell>
  );
}

function CourseMapVisual() {
  return (
    <div className="grid gap-3">
      {courseLayers.map((layer, index) => (
        <div
          key={layer.title}
          className="grid gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)] sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-start"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
            <AppIcon icon={layer.icon} size={21} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[var(--accent-ink)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {layer.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {layer.description}
            </p>
          </div>
          <span className="rounded-md bg-[var(--background-muted)] px-3 py-1 text-xs font-bold text-[var(--text-primary)]">
            {layer.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function LessonFlowVisual() {
  return (
    <ScreenshotShell title="Lesson design">
      <div className="grid gap-0 lg:grid-cols-[1fr_210px]">
        <div className="p-4">
          <div className="rounded-lg bg-[var(--background-muted)] p-4">
            <p className="text-xs font-bold text-[var(--accent-ink)]">Current lesson</p>
            <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              Opinions and justifications
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Students build from a model answer into their own GCSE-style response.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
              <div className="h-full w-[66%] rounded-full bg-[var(--accent-fill)]" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {lessonFlow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border border-[var(--border-subtle)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <AppIcon icon={step.icon} size={19} className="text-[var(--accent-ink)]" />
                  <span className="text-xs font-bold text-[var(--text-muted)]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] p-4">
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Я считаю, что русский полезный, потому что...
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {["opinion", "reason", "exam answer"].map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-[var(--background-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="border-t border-[var(--border-subtle)] bg-[var(--background-muted)] p-4 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase text-[var(--text-muted)]">
            Lesson blocks
          </p>
          <div className="mt-4 grid gap-3">
            {["Explanation", "Vocabulary", "Grammar", "Exam tip", "Question set"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-md bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)]"
                >
                  <AppIcon icon="blocks" size={15} className="text-[var(--accent-ink)]" />
                  {item}
                </div>
              )
            )}
          </div>
        </aside>
      </div>
    </ScreenshotShell>
  );
}

function TierComparisonSection() {
  return (
    <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-0 lg:grid-cols-[0.58fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8">
          <Eyebrow>Foundation and Higher</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            One course route, with tier decisions handled deliberately.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Students should not feel as if they are switching to a different product when
            tier changes. Shared content stays shared; harder work appears when it is
            useful.
          </p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          <div className="hidden grid-cols-[2.4rem_1fr_1fr] gap-4 px-5 py-4 text-xs font-bold uppercase text-[var(--text-muted)] md:grid">
            <span />
            <span>Foundation</span>
            <span>Higher</span>
          </div>
          {tierComparison.map((item) => (
            <div
              key={item.label}
              className="grid gap-4 p-5 md:grid-cols-[2.4rem_1fr_1fr] md:items-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.foundation}
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] md:sr-only">
                  Higher
                </h3>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {item.higher}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExamPaperSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Exam paper fit</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          The course keeps the four papers visible.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          GCSE Russian is not just topic knowledge. Students need to practise how that
          knowledge appears in listening, speaking, reading, and writing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {examPapers.map((paper) => (
          <div
            key={paper.paper}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]"
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
          </div>
        ))}
      </div>
    </section>
  );
}

function PublicAppSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.62fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Guide pages vs course access</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            Public pages help decisions. The course builds the routine.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            The public site answers family questions quickly. Trial access then shows
            the student what the weekly learning route actually feels like.
          </p>
        </div>

        <div className="grid gap-3">
          {publicAppSplit.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-4 rounded-lg bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
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

function CourseIncludesSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        {courseIncludes.map((item) => (
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
      </div>
      <div>
        <Eyebrow>What the platform connects</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Lessons, practice, revision, and mocks belong in one system.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Students can study a topic, practise the language, then return to targeted
          revision without rebuilding their plan from scratch.
        </p>
      </div>
    </section>
  );
}

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
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
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
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-5xl">
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
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
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
              <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
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

        <PublicAppSection />

        <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <Eyebrow>Course questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
              Details families usually check
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
              <Eyebrow>Related pages</Eyebrow>
              <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
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
                <AppIcon icon={link.icon} size={18} className="mb-3 text-[var(--accent-ink)]" />
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
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
