import Link from "next/link";
import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import MarketingBreadcrumbs from "@/components/marketing/marketing-breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import { buildLearningResourceJsonLd } from "@/lib/seo/structured-data";
import type { AppIconKey } from "@/lib/shared/icons";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Resources",
  description:
    "Evergreen GCSE Russian resources for Pearson Edexcel 1RU0 students, including exam paper guides, grammar, vocabulary, past papers, and private-candidate preparation.",
  path: "/resources",
  ogTitle: "GCSE Russian Resources",
  ogDescription:
    "Find exam guides, revision planning, grammar, vocabulary, tier advice, and parent/private-candidate support.",
  ogImagePath: getOgImagePath("resources"),
  ogImageAlt: "GCSE Russian resource library",
});

type ResourceLink = {
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
};

type ResourceGroup = {
  title: string;
  description: string;
  icon: AppIconKey;
  links: ResourceLink[];
};

const resourceGroups: ResourceGroup[] = [
  {
    title: "Understand the exam",
    description:
      "Start here if you need the structure of Pearson Edexcel 1RU0 and the four papers.",
    icon: "exam",
    links: [
      {
        title: "GCSE Russian exam guide",
        description: "The main overview of the four papers, tiers, and revision priorities.",
        href: "/gcse-russian-exam-guide",
        icon: "exam",
      },
      {
        title: "Pearson Edexcel GCSE Russian",
        description: "Qualification orientation for Edexcel 1RU0.",
        href: "/edexcel-gcse-russian",
        icon: "school",
      },
      {
        title: "GCSE Russian past papers",
        description: "Use official papers, mocks, and mistake review more deliberately.",
        href: "/gcse-russian-past-papers",
        icon: "pastPapers",
      },
    ],
  },
  {
    title: "Paper guides",
    description:
      "Go deeper into the specific habits needed for each GCSE Russian paper.",
    icon: "questionSet",
    links: [
      {
        title: "Listening exam",
        description: "Audio strategy, detail, opinions, and distractors.",
        href: "/gcse-russian-listening-exam",
        icon: "listening",
      },
      {
        title: "Speaking exam",
        description: "Role play, picture-based tasks, conversation, and confidence.",
        href: "/gcse-russian-speaking-exam",
        icon: "speaking",
      },
      {
        title: "Reading exam",
        description: "Comprehension, inference, grammar clues, and translation.",
        href: "/gcse-russian-reading-exam",
        icon: "lessonContent",
      },
      {
        title: "Writing exam",
        description: "Accuracy, translation into Russian, planning, and range.",
        href: "/gcse-russian-writing-exam",
        icon: "write",
      },
    ],
  },
  {
    title: "Study skills",
    description:
      "Use these when the student knows the exam shape but needs a better revision method.",
    icon: "calendar",
    links: [
      {
        title: "Revision guide",
        description: "Build a weekly rhythm across vocabulary, grammar, papers, and review.",
        href: "/gcse-russian-revision",
        icon: "calendar",
      },
      {
        title: "Vocabulary guide",
        description: "Recognise, recall, and reuse words for exam tasks.",
        href: "/gcse-russian-vocabulary",
        icon: "vocabulary",
      },
      {
        title: "Grammar guide",
        description: "Use grammar to control meaning, translation, and output.",
        href: "/gcse-russian-grammar",
        icon: "grammar",
      },
    ],
  },
  {
    title: "Decisions and support",
    description:
      "Use these pages when families are choosing tier, support level, or private-candidate arrangements.",
    icon: "users",
    links: [
      {
        title: "Foundation tier",
        description: "Core confidence, accessible tasks, and secure language.",
        href: "/gcse-russian-foundation-tier",
        icon: "layers",
      },
      {
        title: "Higher tier",
        description: "Range, accuracy, translation, and controlled ambition.",
        href: "/gcse-russian-higher-tier",
        icon: "star",
      },
      {
        title: "Parents guide",
        description: "Support the routine without managing every lesson.",
        href: "/gcse-russian-for-parents",
        icon: "users",
      },
      {
        title: "Private candidates",
        description: "Separate course preparation from exam-centre logistics.",
        href: "/russian-gcse-private-candidate",
        icon: "userCheck",
      },
      {
        title: "Tutor or course?",
        description: "Compare self-study, tutor feedback, and online lessons.",
        href: "/gcse-russian-tutor",
        icon: "teacher",
      },
    ],
  },
];

const allResourceLinks: ResourceLink[] = resourceGroups.flatMap((group) => group.links);

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function ResourceHeroVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Resource library</p>
            <p className="mt-1 text-xl font-bold">Guides first, practice next</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            1RU0
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {resourceGroups.map((group) => (
          <div
            key={group.title}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--accent-ink)]">
              <AppIcon icon={group.icon} size={19} />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{group.title}</p>
            <span className="rounded-md bg-[var(--surface-elevated)] px-2 py-1 text-xs font-bold text-[var(--text-secondary)]">
              {group.links.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourceGroupSection() {
  return (
    <section className="space-y-6">
      {resourceGroups.map((group) => (
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

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.links.map((link) => (
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
        </div>
      ))}
    </section>
  );
}

export default function GcseRussianResourcesPage() {
  return (
    <>
      <JsonLd
        data={buildLearningResourceJsonLd({
          name: "GCSE Russian Resources",
          description:
            "Evergreen GCSE Russian resources for Pearson Edexcel 1RU0 students, including exam paper guides, grammar, vocabulary, past papers, and private-candidate preparation.",
          path: "/resources",
          keywords: [
            "GCSE Russian resources",
            "Edexcel Russian GCSE",
            "Russian GCSE revision",
          ],
          relatedLinks: allResourceLinks,
        })}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "Resources", href: "/resources" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="exam">
                Paper guides
              </Badge>
              <Badge tone="muted" icon="vocabulary">
                Grammar and vocabulary
              </Badge>
            </div>

            <Eyebrow>GCSE Russian resources</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              Find the right guide before opening another tab.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              Use the public guides to understand the exam, plan revision, compare support
              routes, and decide when the student is ready to move into structured course
              practice.
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

          <ResourceHeroVisual />
        </section>

        <ResourceGroupSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                Use the guides, then practise in the app.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                The public site explains what to study. The app provides structured
                lessons, practice, progress tracking, and account-based course access.
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
