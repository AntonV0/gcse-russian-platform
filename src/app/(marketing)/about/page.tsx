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
  title: "About GCSE Russian",
  description:
    "Learn about GCSERussian.com, a focused GCSE Russian course platform for Pearson Edexcel 1RU0 students, parents, private candidates, and Volna learners.",
  path: "/about",
  ogTitle: "About GCSERussian.com",
  ogDescription:
    "A structured GCSE Russian course platform built around Pearson Edexcel 1RU0 preparation.",
  ogImagePath: getOgImagePath("about"),
  ogImageAlt: "About GCSERussian.com",
});

type AboutItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

const principles = [
  {
    title: "Specific to GCSE Russian",
    description:
      "The platform is shaped around Pearson Edexcel 1RU0 preparation rather than generic language-learning content.",
    icon: "school",
  },
  {
    title: "Structured enough to follow",
    description:
      "Lessons, vocabulary, grammar, question practice, revision, and mock preparation are organised so the next step stays visible.",
    icon: "navigation",
  },
  {
    title: "Useful for families",
    description:
      "Parents can understand the route without needing to teach Russian or manage every answer themselves.",
    icon: "users",
  },
] satisfies AboutItem[];

const productBoundaries = [
  {
    title: "Independent course",
    description:
      "GCSERussian.com is independent. Pearson remains the source for official qualification documents and materials.",
    icon: "info",
  },
  {
    title: "Volna teaching workflows",
    description:
      "The same platform can support Volna-style teacher workflows and independent self-study without splitting the learning model.",
    icon: "teacher",
  },
  {
    title: "Trial-first access",
    description:
      "Students can inspect the learning environment before a family chooses paid access.",
    icon: "unlocked",
  },
] satisfies AboutItem[];

const audienceFit = [
  {
    title: "Students",
    description:
      "Need a calm route through lessons, practice, revision, and paper-specific preparation.",
    icon: "student",
  },
  {
    title: "Parents",
    description:
      "Need visibility, reassurance, and clearer decisions about support, tier, and routine.",
    icon: "users",
  },
  {
    title: "Private candidates",
    description:
      "Need structured preparation while exam entry and speaking arrangements are handled separately.",
    icon: "userCheck",
  },
] satisfies AboutItem[];

const relatedLinks = [
  {
    title: "Online GCSE Russian course",
    description: "See how the course is structured for Pearson Edexcel preparation.",
    href: "/gcse-russian-course",
    icon: "courses" as const,
  },
  {
    title: "GCSE Russian for parents",
    description: "Understand how families can support course and exam preparation.",
    href: "/gcse-russian-for-parents",
    icon: "users" as const,
  },
  {
    title: "Pearson Edexcel GCSE Russian",
    description: "Understand 1RU0 and the four-paper qualification shape.",
    href: "/edexcel-gcse-russian",
    icon: "school" as const,
  },
  {
    title: "Course pricing",
    description: "Compare Foundation and Higher access after trial-first signup.",
    href: "/pricing",
    icon: "pricing" as const,
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
}>;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">{children}</p>
  );
}

function AboutVisual() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-lg)]">
      <div className="rounded-lg marketing-dark-panel p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs opacity-70">Course platform</p>
            <p className="mt-1 text-xl font-bold">GCSE Russian, organised</p>
          </div>
          <span className="rounded-md bg-[var(--accent-fill)] px-3 py-1 text-xs font-bold text-[var(--accent-on-fill)]">
            1RU0
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {[
          ["Course route", "Foundation and Higher pathways", "layers"],
          ["Practice", "Vocabulary, grammar, questions, mocks", "exercise"],
          ["Support", "Self-study with optional teaching workflows", "teacher"],
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

function PrincipleSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.48fr_1fr] lg:items-start">
        <div>
          <Eyebrow>Why this exists</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
            GCSE Russian needs a more direct route than scattered revision notes.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            It is a smaller subject with specific exam demands. The platform exists to
            make preparation easier to organise for students and easier to understand for
            families.
          </p>
        </div>
        <div className="grid gap-4">
          {principles.map((item) => (
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

function BoundarySection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
      <div className="grid gap-6 sm:grid-cols-3">
        {productBoundaries.map((item) => (
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
        <Eyebrow>Clear boundaries</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)] md:text-4xl">
          The product should be useful without pretending to be the awarding body.
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The public pages explain preparation decisions. The app provides the learning
          route. Official Pearson documents remain the source for formal qualification
          details.
        </p>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
      <div className="grid lg:grid-cols-[0.72fr_1fr]">
        <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
          <Eyebrow>Who it serves</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            Built for the reality around GCSE Russian.
          </h2>
          <p className="mt-4 text-base leading-7 opacity-80">
            Students need direction. Parents need visibility. Private candidates need
            preparation that can run alongside separate exam-centre logistics.
          </p>
        </div>
        <div className="grid divide-y divide-[var(--border-subtle)]">
          {audienceFit.map((item) => (
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

function RelatedLinksSection() {
  return (
    <section className="rounded-lg bg-[var(--background-muted)] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Continue from here</Eyebrow>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--text-primary)]">
            Move from context into a practical decision
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

export default function MarketingAboutPage() {
  return (
    <>
      <JsonLd
        data={buildLearningResourceJsonLd({
          name: "About GCSERussian.com",
          description:
            "Learn about GCSERussian.com, a focused GCSE Russian course platform for Pearson Edexcel 1RU0 students, parents, private candidates, and Volna learners.",
          path: "/about",
          keywords: ["GCSE Russian course", "Pearson Edexcel Russian", "Volna Russian"],
          relatedLinks,
        })}
      />

      <MarketingBreadcrumbs
        items={[
          { label: "Home", href: "/marketing" },
          { label: "About", href: "/about" },
        ]}
      />

      <div className="space-y-16 py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
              <Badge tone="muted" icon="teacher">
                Volna teaching workflows
              </Badge>
              <Badge tone="success" icon="unlocked">
                Trial-first access
              </Badge>
            </div>

            <Eyebrow>About GCSERussian.com</Eyebrow>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-none text-[var(--text-primary)] md:text-6xl">
              A focused course platform for GCSE Russian.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
              GCSERussian.com helps students prepare for Pearson Edexcel GCSE Russian
              with a clearer route through lessons, vocabulary, grammar, exam-style
              practice, revision, and progress tracking.
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

          <AboutVisual />
        </section>

        <PrincipleSection />
        <BoundarySection />
        <AudienceSection />
        <RelatedLinksSection />

        <section className="rounded-lg marketing-dark-panel p-6 shadow-[var(--shadow-lg)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
                See whether the route fits the student.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-80">
                A trial account lets students and families inspect the course structure
                before choosing paid access.
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
