import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";

const platformHighlights = [
  {
    title: "Structured learning",
    description:
      "Lessons, modules, and guided progression designed for GCSE Russian revision and study.",
    icon: appIcons.lessons,
  },
  {
    title: "Interactive practice",
    description:
      "Vocabulary, questions, translations, and listening tasks in one focused learning space.",
    icon: appIcons.question,
  },
  {
    title: "Track progress",
    description:
      "Clear learning paths, course access, and progress visibility for students and teachers.",
    icon: appIcons.completed,
  },
];

const landingLinks = [
  {
    title: "Lessons",
    description:
      "Explore structured modules and lesson pathways built around GCSE Russian study.",
    href: "/courses",
    icon: appIcons.lessons,
  },
  {
    title: "Practice",
    description:
      "Work through vocabulary, translation, listening, and exam-style revision tasks.",
    href: "/dashboard",
    icon: appIcons.audio,
  },
  {
    title: "Progress",
    description:
      "Track completion, continue where you left off, and keep revision organised.",
    href: "/dashboard",
    icon: appIcons.completed,
  },
];

export default function Home() {
  return (
    <div className="py-8 md:py-12">
      <section className="app-surface-brand app-section-padding-lg overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.92fr)] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge tone="info" icon={appIcons.info}>
                Private development build
              </Badge>

              <div className="app-header-block">
                <h1 className="app-title max-w-3xl">GCSE Russian Course Platform</h1>

                <p className="app-subtitle max-w-2xl">
                  A clean, structured online learning platform for GCSE Russian, combining
                  lessons, vocabulary, practice tasks, and progress tracking in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/dashboard" variant="primary" icon={appIcons.dashboard}>
                Open dashboard
              </Button>

              <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                Browse courses
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon={appIcons.school}>
                Edexcel GCSE 1RU0
              </Badge>
              <Badge tone="muted" icon={appIcons.layers}>
                Foundation + Higher
              </Badge>
              <Badge tone="muted" icon={appIcons.language}>
                Themes · Grammar · Mocks
              </Badge>
            </div>
          </div>

          <div className="app-card app-section-padding">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="app-section-title">What this app is for</h2>
                <p className="mt-1 text-sm app-text-muted">
                  A focused GCSE Russian study space for self-study and teacher-led use.
                </p>
              </div>

              <AppIcon
                icon={appIcons.uiLab}
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
                icon={appIcons.next}
                size={16}
                className="app-text-soft app-card-link-arrow"
              />
            </div>

            <p className="app-text-muted text-sm">{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
