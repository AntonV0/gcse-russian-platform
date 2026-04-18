import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import { appIcons } from "@/lib/shared/icons";
import { getCurrentUser } from "@/lib/auth/auth";

const vocabularyThemes = [
  {
    title: "Identity and personal world",
    description:
      "Family, friends, daily routine, hobbies, and describing people with confidence.",
    russian: "Семья, друзья, хобби",
  },
  {
    title: "School and future plans",
    description:
      "Subjects, school life, ambitions, work, and useful GCSE-style topic language.",
    russian: "Школа и планы на будущее",
  },
  {
    title: "Home, town, and region",
    description:
      "Useful vocabulary for house, area, transport, places in town, and local life.",
    russian: "Дом, город и район",
  },
  {
    title: "Travel and holidays",
    description: "Transport, bookings, tourism, opinions, and practical travel language.",
    russian: "Путешествия и каникулы",
  },
  {
    title: "Food and healthy living",
    description:
      "Meals, shopping, health, routine, and lifestyle-focused topic vocabulary.",
    russian: "Еда и здоровый образ жизни",
  },
  {
    title: "Technology and media",
    description:
      "Phones, internet, media habits, online life, and everyday digital vocabulary.",
    russian: "Технологии и медиа",
  },
];

export default async function VocabularyPage() {
  const user = await getCurrentUser();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary"
        description="Build topic-based GCSE Russian vocabulary and revise useful language in manageable sections."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon={appIcons.language}>
                Vocabulary hub
              </Badge>
              <Badge tone="muted" icon={appIcons.school}>
                GCSE Russian
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Grow your word bank</h2>
              <p className="app-subtitle max-w-2xl">
                This section will become the home for topic vocabulary, revision sets, and
                future searchable language support across the platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/courses" variant="primary" icon={appIcons.courses}>
                Back to courses
              </Button>

              <Button href="/dashboard" variant="secondary" icon={appIcons.dashboard}>
                Dashboard
              </Button>
            </div>
          </div>

          <DashboardCard title="How this section will help">
            <div className="space-y-3">
              <p>
                Vocabulary support fits naturally alongside your lessons, practice, and
                revision. Over time this can connect to course content, topic pages, and
                exam preparation tools.
              </p>

              <ul className="space-y-2">
                <li>• Topic-based revision support</li>
                <li>• GCSE-relevant word groupings</li>
                <li>• Russian + English reference structure</li>
                <li>• Future searchable word lists</li>
              </ul>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vocabularyThemes.map((theme) => (
          <DashboardCard key={theme.title} title={theme.title}>
            <div className="space-y-3">
              <p>{theme.description}</p>
              <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-primary)]">
                {theme.russian}
              </div>
            </div>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="What can come next">
          <div className="space-y-3">
            <p>
              A strong next step would be to connect this page to real database-backed
              vocabulary sets so that students can revise by topic, course path, or exam
              skill.
            </p>

            <ul className="space-y-2">
              <li>• Topic vocabulary lists</li>
              <li>• Skill-specific sets</li>
              <li>• Revision cards and filters</li>
              <li>• Links into lesson content</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Keep learning">
          <div className="space-y-3">
            <p>
              Vocabulary works best when combined with lesson study and regular revision.
            </p>

            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Explore grammar
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>

      {!user ? (
        <DashboardCard title="Not signed in">
          Log in to connect future vocabulary tools to your student dashboard and course
          experience.
        </DashboardCard>
      ) : null}
    </main>
  );
}
