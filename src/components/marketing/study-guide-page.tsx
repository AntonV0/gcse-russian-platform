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

export type StudyGuideItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

export type StudyGuideRelatedLink = {
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
};

export type StudyGuideFaq = {
  question: string;
  answer: string;
};

type StudyGuidePageProps = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
  badges: { label: string; icon: AppIconKey; tone?: "muted" | "info" | "success" | "warning" }[];
  heroIcon: AppIconKey;
  heroLabel: string;
  heroMetric: string;
  heroRows: [string, string, AppIconKey][];
  focusTitle: string;
  focusDescription: string;
  focusItems: StudyGuideItem[];
  routineTitle: string;
  routineDescription: string;
  routineItems: StudyGuideItem[];
  warningTitle: string;
  warningDescription: string;
  warningItems: StudyGuideItem[];
  courseFitTitle: string;
  courseFitDescription: string;
  courseFitItems: StudyGuideItem[];
  relatedLinks: StudyGuideRelatedLink[];
  faqs: StudyGuideFaq[];
  ctaTitle: string;
  ctaDescription: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function GuideHeroVisual({
  heroIcon,
  heroLabel,
  heroMetric,
  heroRows,
}: Pick<StudyGuidePageProps, "heroIcon" | "heroLabel" | "heroMetric" | "heroRows">) {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">{heroLabel}</p>
            <p className="mt-1 text-xl font-bold">{heroMetric}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--accent-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon={heroIcon} size={24} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {heroRows.map(([label, value, icon]) => (
          <div
            key={label}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon={icon} size={19} />
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
  items: StudyGuideItem[];
}) {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>What matters first</Eyebrow>
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

function RoutineSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: StudyGuideItem[];
}) {
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
        <Eyebrow>How to use it</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </section>
  );
}

function WarningSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: StudyGuideItem[];
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Common traps</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">{description}</p>
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

function getStudyVisualConfig(heroIcon: AppIconKey) {
  if (heroIcon === "vocabulary") {
    return {
      eyebrow: "Recall loop",
      title: "Vocabulary should move from recognition into usable language.",
      description:
        "Students need to see words, retrieve them, spell them, and then use them inside sentences that look closer to exam tasks.",
      stages: ["Recognise", "Recall", "Use"],
      notes: ["English meaning", "Russian spelling", "sentence output"],
      icon: "vocabulary" as const,
    };
  }

  if (heroIcon === "grammar") {
    return {
      eyebrow: "Sentence control",
      title: "Grammar works best when it changes what a student can say.",
      description:
        "Rules should quickly turn into sentence transformations, translations, and small answer upgrades students can repeat.",
      stages: ["Pattern", "Change", "Check"],
      notes: ["ending", "tense", "meaning"],
      icon: "grammar" as const,
    };
  }

  if (heroIcon === "calendar") {
    return {
      eyebrow: "Weekly rhythm",
      title: "Revision needs a routine that survives busy school weeks.",
      description:
        "The strongest plan mixes short retrieval, one focused weak point, paper practice, and review instead of another long list of topics.",
      stages: ["Review", "Target", "Repeat"],
      notes: ["10 minutes", "one weakness", "next session"],
      icon: "calendar" as const,
    };
  }

  if (heroIcon === "pastPapers") {
    return {
      eyebrow: "Paper review",
      title: "Past papers are most useful after the mistake has a name.",
      description:
        "Scores matter less than the pattern behind them: vocabulary gap, grammar error, task misunderstanding, or timing problem.",
      stages: ["Attempt", "Mark", "Fix"],
      notes: ["paper", "cause", "follow-up"],
      icon: "pastPapers" as const,
    };
  }

  if (heroIcon === "star") {
    return {
      eyebrow: "Higher readiness",
      title: "Range only helps when accuracy travels with it.",
      description:
        "Higher preparation should stretch vocabulary and response length while still protecting verb control, endings, and task coverage.",
      stages: ["Range", "Accuracy", "Pressure"],
      notes: ["wider ideas", "clean endings", "timed task"],
      icon: "star" as const,
    };
  }

  return {
    eyebrow: "Tier confidence",
    title: "Foundation progress should feel secure before it feels ambitious.",
    description:
      "A good Foundation route keeps the student moving through familiar topics, reliable sentences, and accessible paper tasks.",
    stages: ["Secure", "Practise", "Apply"],
    notes: ["core words", "simple pattern", "paper task"],
    icon: "layers" as const,
  };
}

function StudySpecificVisualSection({ heroIcon }: { heroIcon: AppIconKey }) {
  const visual = getStudyVisualConfig(heroIcon);

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <Eyebrow>{visual.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          {visual.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          {visual.description}
        </p>
      </div>

      <div className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-6">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
                Study loop
              </p>
              <p className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">
                Repeatable progress
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--background-muted)] text-[var(--accent-ink)]">
              <AppIcon icon={visual.icon} size={24} />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {visual.stages.map((stage, index) => (
              <div
                key={stage}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-fill)] text-sm font-extrabold text-[var(--accent-on-fill)]">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {stage}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    {visual.notes[index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseFitSection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: StudyGuideItem[];
}) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:items-start">
      <div>
        <Eyebrow>Where the course helps</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          {description}
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
  relatedLinks: StudyGuideRelatedLink[];
}) {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Useful next pages</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Connect this guide to the wider plan
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

function FaqSection({ faqs }: { faqs: StudyGuideFaq[] }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
      <div>
        <Eyebrow>Guide questions</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
          What students usually need clarified
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

export default function StudyGuidePage({
  path,
  eyebrow,
  title,
  description,
  keywords,
  badges,
  heroIcon,
  heroLabel,
  heroMetric,
  heroRows,
  focusTitle,
  focusDescription,
  focusItems,
  routineTitle,
  routineDescription,
  routineItems,
  warningTitle,
  warningDescription,
  warningItems,
  courseFitTitle,
  courseFitDescription,
  courseFitItems,
  relatedLinks,
  faqs,
  ctaTitle,
  ctaDescription,
  secondaryHref = "/gcse-russian-exam-guide",
  secondaryLabel = "Exam guide",
}: StudyGuidePageProps) {
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
          { label: "Resources", href: "/resources" },
          { label: eyebrow, href: path },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge.label} tone={badge.tone ?? "muted"} icon={badge.icon}>
                  {badge.label}
                </Badge>
              ))}
            </div>

            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              {description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/signup" variant="primary" icon="create">
                Start trial
              </Button>
              <Button href={secondaryHref} variant="secondary" icon="exam">
                {secondaryLabel}
              </Button>
            </div>
          </div>

          <GuideHeroVisual
            heroIcon={heroIcon}
            heroLabel={heroLabel}
            heroMetric={heroMetric}
            heroRows={heroRows}
          />
        </section>

        <FocusSection
          title={focusTitle}
          description={focusDescription}
          items={focusItems}
        />
        <StudySpecificVisualSection heroIcon={heroIcon} />
        <RoutineSection
          title={routineTitle}
          description={routineDescription}
          items={routineItems}
        />
        <WarningSection
          title={warningTitle}
          description={warningDescription}
          items={warningItems}
        />
        <CourseFitSection
          title={courseFitTitle}
          description={courseFitDescription}
          items={courseFitItems}
        />
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
