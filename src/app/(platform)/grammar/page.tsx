import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import { appIcons } from "@/lib/shared/icons";

const grammarAreas = [
  {
    title: "Cases",
    description:
      "Build confidence with nominative, accusative, genitive, dative, instrumental, and prepositional usage.",
  },
  {
    title: "Verb forms",
    description:
      "Present, past, future, infinitives, aspect basics, and useful GCSE-style verb patterns.",
  },
  {
    title: "Adjectives and agreement",
    description:
      "Gender, number, case agreement, and describing people, places, and things accurately.",
  },
  {
    title: "Pronouns",
    description:
      "Personal, possessive, and other core pronoun patterns that appear frequently in exam tasks.",
  },
  {
    title: "Sentence structure",
    description:
      "Word order, connectives, opinions, reasons, and writing with more control and variety.",
  },
  {
    title: "Translation support",
    description:
      "Grammar help focused on common translation patterns and exam-relevant accuracy issues.",
  },
];

export default function GrammarPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Grammar"
        description="Review key Russian grammar areas in a clearer, more structured way."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="lessonContent">
                Grammar hub
              </Badge>
              <Badge tone="muted" icon="school">
                GCSE Russian
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Understand the rules more clearly</h2>
              <p className="app-subtitle max-w-2xl">
                This section is the future home for grammar explanations, examples, and
                revision support that can sit alongside lessons and exam preparation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/dashboard" variant="primary" icon="dashboard">
                Dashboard
              </Button>

              <Button href="/courses" variant="secondary" icon="courses">
                Courses
              </Button>
            </div>
          </div>

          <DashboardCard title="Why this matters">
            <div className="space-y-3">
              <p>
                Strong grammar improves reading, writing, translation, and speaking. A
                dedicated grammar area makes revision easier than hiding everything inside
                lessons only.
              </p>

              <ul className="space-y-2">
                <li>• Better writing accuracy</li>
                <li>• More confident translation</li>
                <li>• Clearer sentence building</li>
                <li>• Easier revision before exams</li>
              </ul>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grammarAreas.map((area) => (
          <DashboardCard key={area.title} title={area.title}>
            <p>{area.description}</p>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="Future direction">
          <div className="space-y-3">
            <p>
              A strong next step here would be structured grammar reference pages linked
              to lesson sections, with examples, explanations, and exam-focused reminders.
            </p>

            <ul className="space-y-2">
              <li>• Grammar reference notes</li>
              <li>• Example sentences</li>
              <li>• Common mistake callouts</li>
              <li>• Links to related lessons</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Related resource">
          <div className="space-y-3">
            <p>Pair grammar study with topic vocabulary to make revision stick better.</p>

            <Link
              href="/vocabulary"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Explore vocabulary
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
