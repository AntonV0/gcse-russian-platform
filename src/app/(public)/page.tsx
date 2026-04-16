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

export default function Home() {
  return (
    <main className="app-page py-10 md:py-14">
      <section className="app-surface-brand app-section-padding-lg overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:items-center">
          {/* Hero copy */}
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

            {/* Main actions */}
            <div className="flex flex-wrap gap-3">
              <Button href="/dashboard" variant="primary" icon={appIcons.dashboard}>
                Open dashboard
              </Button>

              <Button href="/courses" variant="secondary" icon={appIcons.courses}>
                Browse courses
              </Button>
            </div>

            {/* Quick value points */}
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon={appIcons.learning}>
                GCSE-focused
              </Badge>
              <Badge tone="muted" icon={appIcons.translation}>
                Language practice
              </Badge>
              <Badge tone="muted" icon={appIcons.users}>
                Student + teacher tools
              </Badge>
            </div>
          </div>

          {/* Right-side preview panel */}
          <div className="app-surface app-section-padding app-interactive">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="app-section-title">What this app is for</h2>
              <AppIcon icon={appIcons.uiLab} size={20} className="app-brand-text" />
            </div>

            <div className="space-y-4">
              {platformHighlights.map((item) => (
                <div
                  key={item.title}
                  className="app-surface-muted flex items-start gap-3 p-4"
                >
                  <div className="mt-0.5 rounded-xl bg-[var(--brand-blue-soft)] p-2">
                    <AppIcon
                      icon={item.icon}
                      size={18}
                      className="text-[var(--brand-blue)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
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

      {/* Secondary section keeps the page from feeling too empty while the public app is still simple. */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="app-card app-card-hover app-section-padding">
          <div className="mb-3 flex items-center gap-2">
            <AppIcon icon={appIcons.lessons} size={18} className="app-brand-text" />
            <h2 className="app-section-title">Lessons</h2>
          </div>
          <p className="app-text-muted text-sm">
            Build around modular lessons and guided progression rather than a flat list of
            resources.
          </p>
        </div>

        <div className="app-card app-card-hover app-section-padding">
          <div className="mb-3 flex items-center gap-2">
            <AppIcon icon={appIcons.audio} size={18} className="app-brand-text" />
            <h2 className="app-section-title">Practice</h2>
          </div>
          <p className="app-text-muted text-sm">
            Support multiple exercise types like vocabulary, translation, listening, and
            question-based revision.
          </p>
        </div>

        <div className="app-card app-card-hover app-section-padding">
          <div className="mb-3 flex items-center gap-2">
            <AppIcon icon={appIcons.completed} size={18} className="app-brand-text" />
            <h2 className="app-section-title">Progress</h2>
          </div>
          <p className="app-text-muted text-sm">
            Keep the experience structured for students while still supporting admin and
            teacher workflows behind the scenes.
          </p>
        </div>
      </section>
    </main>
  );
}
