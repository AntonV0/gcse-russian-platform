import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import {
  buildFaqJsonLd,
  buildLearningResourceJsonLd,
} from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export type ExamPaperGuideItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

export type ExamPaperGuideRelatedLink = {
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
};

export type ExamPaperGuideFaq = {
  question: string;
  answer: string;
};

type ExamPaperGuidePageProps = {
  path: string;
  eyebrow: string;
  paperLabel: string;
  badgeLabel: string;
  title: string;
  description: string;
  keywords: string[];
  heroIcon: AppIconKey;
  heroMetric: string;
  heroFocus: string;
  heroSupport: string;
  skillFocus: ExamPaperGuideItem[];
  practiceRoutine: ExamPaperGuideItem[];
  commonErrors: ExamPaperGuideItem[];
  courseFit: ExamPaperGuideItem[];
  relatedLinks: ExamPaperGuideRelatedLink[];
  faqs: ExamPaperGuideFaq[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  ctaTitle: string;
  ctaDescription: string;
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function PaperHeroVisual({
  paperLabel,
  heroIcon,
  heroMetric,
  heroFocus,
  heroSupport,
}: Pick<
  ExamPaperGuidePageProps,
  "paperLabel" | "heroIcon" | "heroMetric" | "heroFocus" | "heroSupport"
>) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">{paperLabel}</p>
            <p className="mt-1 text-xl font-bold">{heroMetric}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon={heroIcon} size={24} />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background)]/20">
          <div className="h-full w-[64%] rounded-full bg-[var(--accent-fill)]" />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Student focus", heroFocus, "student"],
          ["Useful support", heroSupport, "completed"],
          ["Next step", "Practise with a paper-specific routine", "navigation"],
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

function FocusSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ExamPaperGuideItem[];
}) {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>What to build</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
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

function RoutineSection({ items }: { items: ExamPaperGuideItem[] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="relative grid gap-4">
        <div className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-[var(--accent-fill)]/25" />
        {items.map((item, index) => (
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
        <Eyebrow>Practice routine</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Improvement comes from a repeatable routine, not a single revision burst.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Paper-specific practice should connect back to vocabulary, grammar, topic
          knowledge, and mistake review so students can see what to do next.
        </p>
      </div>
    </section>
  );
}

function ErrorSection({ items }: { items: ExamPaperGuideItem[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Common mistakes</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Marks are often lost through habits students can fix.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            The goal is not to make the paper feel easy. It is to make the avoidable
            errors visible early enough to practise them.
          </p>
        </div>

        <div className="grid divide-y divide-[var(--border-subtle)]">
          {items.map((item) => (
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

function getPaperVisualConfig(heroIcon: AppIconKey) {
  if (heroIcon === "listening") {
    return {
      eyebrow: "Audio strategy",
      title: "Treat audio practice like evidence, not a guessing exercise.",
      description:
        "Students need a way to notice what they missed: topic clues, repeated words, time markers, negatives, and distractors.",
      labels: ["Gist", "Detail", "Review"],
      sample: ["speaker attitude", "time marker", "negative clue"],
      icon: "audio" as const,
    };
  }

  if (heroIcon === "speaking") {
    return {
      eyebrow: "Spoken response",
      title: "Build flexible answers before the speaking window.",
      description:
        "Speaking improves when students rehearse useful answer shapes, not just one memorised paragraph that breaks under a new prompt.",
      labels: ["Prompt", "Answer", "Extend"],
      sample: ["role play", "picture cue", "follow-up question"],
      icon: "speaking" as const,
    };
  }

  if (heroIcon === "write") {
    return {
      eyebrow: "Answer planning",
      title: "Plan the answer before adding range.",
      description:
        "Writing is strongest when students secure task coverage, tense, opinions, reasons, and translation accuracy before trying to sound impressive.",
      labels: ["Plan", "Write", "Check"],
      sample: ["time frame", "opinion + reason", "verb ending"],
      icon: "write" as const,
    };
  }

  return {
    eyebrow: "Text strategy",
    title: "Use the text, grammar clues, and question wording together.",
    description:
      "Reading improves when students stop chasing isolated familiar words and instead connect vocabulary, endings, negatives, and context.",
    labels: ["Question", "Clue", "Meaning"],
    sample: ["keyword", "case ending", "translation choice"],
    icon: "lessonContent" as const,
  };
}

function PaperSpecificVisualSection({
  heroIcon,
  badgeLabel,
}: {
  heroIcon: AppIconKey;
  badgeLabel: string;
}) {
  const visual = getPaperVisualConfig(heroIcon);

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
      <div className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-6">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
                {badgeLabel} workflow
              </p>
              <p className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">
                Practice loop
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
              <AppIcon icon={visual.icon} size={24} />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {visual.labels.map((label, index) => (
              <div
                key={label}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-fill)] text-sm font-extrabold text-[var(--accent-on-fill)]">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {label}
                    </p>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">
                      {visual.sample[index]}
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--background-muted)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent-fill)]"
                      style={{ width: `${52 + index * 16}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Eyebrow>{visual.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          {visual.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          {visual.description}
        </p>
      </div>
    </section>
  );
}

function CourseFitSection({ items }: { items: ExamPaperGuideItem[] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Where the course helps</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          Paper practice works better when it is connected to the rest of the course.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          Students should not revise this paper in isolation. The strongest preparation
          links task practice back to language foundations and progress tracking.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
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

function RelatedLinksSection({
  relatedLinks,
}: {
  relatedLinks: ExamPaperGuideRelatedLink[];
}) {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Useful next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Connect this paper to the wider plan
          </h2>
        </div>
        <Button href="/gcse-russian-exam-guide" variant="secondary" icon="exam">
          Exam guide
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

function FaqSection({ faqs }: { faqs: ExamPaperGuideFaq[] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
      <div>
        <Eyebrow>Paper questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          The details students usually need clarified
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

export default function ExamPaperGuidePage({
  path,
  eyebrow,
  paperLabel,
  badgeLabel,
  title,
  description,
  keywords,
  heroIcon,
  heroMetric,
  heroFocus,
  heroSupport,
  skillFocus,
  practiceRoutine,
  commonErrors,
  courseFit,
  relatedLinks,
  faqs,
  primaryHref = "/signup",
  primaryLabel = "Start trial",
  secondaryHref = "/gcse-russian-course",
  secondaryLabel = "View course",
  ctaTitle,
  ctaDescription,
}: ExamPaperGuidePageProps) {
  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd({
            name: title,
            description,
            path,
            keywords,
            relatedLinks,
          }),
          buildFaqJsonLd(faqs),
        ]}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Exam guide", href: "/gcse-russian-exam-guide" },
          { label: badgeLabel, href: path },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon={heroIcon}>
                {badgeLabel}
              </Badge>
              <Badge tone="muted" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
            </div>

            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              {description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={primaryHref} variant="primary" icon="create">
                {primaryLabel}
              </Button>
              <Button href={secondaryHref} variant="secondary" icon="courses">
                {secondaryLabel}
              </Button>
            </div>
          </div>

          <PaperHeroVisual
            paperLabel={paperLabel}
            heroIcon={heroIcon}
            heroMetric={heroMetric}
            heroFocus={heroFocus}
            heroSupport={heroSupport}
          />
        </section>

        <FocusSection
          title={`${badgeLabel} preparation needs more than generic revision.`}
          description="This page focuses on the habits and practice types that matter most for this specific GCSE Russian paper."
          items={skillFocus}
        />
        <PaperSpecificVisualSection heroIcon={heroIcon} badgeLabel={badgeLabel} />
        <RoutineSection items={practiceRoutine} />
        <ErrorSection items={commonErrors} />
        <CourseFitSection items={courseFit} />
        <FaqSection faqs={faqs} />
        <RelatedLinksSection relatedLinks={relatedLinks} />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                {ctaTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                {ctaDescription}
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
