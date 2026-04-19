import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import type { AppIconKey } from "@/lib/shared/icons";

type HighlightItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

type LandingLinkItem = {
  title: string;
  description: string;
  href: string;
  icon: AppIconKey;
};

type AudienceItem = {
  title: string;
  description: string;
  icon: AppIconKey;
};

const platformHighlights: HighlightItem[] = [
  {
    title: "Structured learning",
    description:
      "Clear lesson pathways across topics, designed specifically for GCSE Russian progression.",
    icon: "lessons",
  },
  {
    title: "Exam-focused practice",
    description:
      "Translation, listening, vocabulary, and exam-style tasks aligned with Edexcel 1RU0.",
    icon: "question",
  },
  {
    title: "Track progress",
    description:
      "See what you’ve completed, what’s next, and stay organised throughout your revision.",
    icon: "completed",
  },
];

const landingLinks: LandingLinkItem[] = [
  {
    title: "Pricing",
    description:
      "Choose Foundation or Higher access and start the real Stripe checkout flow.",
    href: "/pricing",
    icon: "courses",
  },
  {
    title: "Lessons",
    description:
      "Follow structured modules covering themes, grammar, and vocabulary step by step.",
    href: "/courses",
    icon: "lessons",
  },
  {
    title: "Progress",
    description: "Track completion and continue your learning without losing your place.",
    href: "/dashboard",
    icon: "completed",
  },
];

const audience: AudienceItem[] = [
  {
    title: "Students",
    description:
      "Ideal for GCSE Russian students who want a clear structure for revision and learning.",
    icon: "school",
  },
  {
    title: "Parents",
    description:
      "A reliable, structured platform to support your child’s GCSE Russian preparation.",
    icon: "user",
  },
  {
    title: "Volna students",
    description:
      "Integrated with teacher-led learning, assignments, and feedback workflows.",
    icon: "dashboard",
  },
];

export default function Home() {
  return (
    <div className="py-8 md:py-12">
      <section className="app-surface-brand app-section-padding-lg overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.92fr)] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge tone="info" icon="info">
                Private development build
              </Badge>

              <div className="app-header-block">
                <h1 className="app-title max-w-3xl">GCSE Russian Course Platform</h1>

                <p className="app-subtitle max-w-2xl">
                  A structured online learning platform for Pearson Edexcel GCSE Russian
                  (1RU0), combining structured lessons, exam-focused practice, and
                  progress tracking for Foundation and Higher students.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/pricing" variant="primary" icon="courses">
                View pricing
              </Button>

              <Button href="/courses" variant="secondary" icon="lessons">
                Browse courses
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon="school">
                Edexcel GCSE 1RU0
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation + Higher
              </Badge>
              <Badge tone="muted" icon="language">
                Themes · Grammar · Mocks
              </Badge>
            </div>
          </div>

          <div className="app-card app-section-padding">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="app-section-title">Built for GCSE Russian</h2>
                <p className="mt-1 text-sm app-text-muted">
                  Designed to support both independent study and teacher-led learning.
                </p>
              </div>

              <AppIcon
                icon="uiLab"
                size={18}
                className="mt-0.5 shrink-0 app-brand-text"
              />
            </div>

            <div className="space-y-4">
              {platformHighlights.map((item) => (
                <div
                  key={item.title}
                  className="app-card app-card-hover flex items-start gap-4 p-4"
                >
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-blue-soft)] ring-1 ring-[color:var(--brand-blue)]/15">
                    <AppIcon
                      icon={item.icon}
                      size={20}
                      className="text-[var(--brand-blue)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {landingLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="app-card app-card-hover app-section-padding block cursor-pointer transition"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AppIcon icon={item.icon} size={18} className="app-brand-text" />
                <h2 className="app-section-title">{item.title}</h2>
              </div>

              <AppIcon
                icon="next"
                size={16}
                className="app-text-soft app-card-link-arrow"
              />
            </div>

            <p className="app-text-muted text-sm">{item.description}</p>
          </Link>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="app-section-title text-lg">Who this platform is for</h2>
          <p className="text-sm app-text-muted mt-1">
            Designed to support GCSE Russian students and families at every stage of
            preparation.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {audience.map((item) => (
            <div
              key={item.title}
              className="app-card app-section-padding flex items-start gap-4"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-muted)]">
                <AppIcon icon={item.icon} size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-sm app-text-muted mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
