import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";

const paperAreas = [
  {
    title: "Reading practice",
    description:
      "Work with comprehension-style tasks, scanning skills, and exam-style reading confidence.",
  },
  {
    title: "Listening practice",
    description:
      "Prepare for audio-based tasks with structured support and future listening resources.",
  },
  {
    title: "Translation practice",
    description:
      "Build exam confidence with targeted translation-style revision and grammar-aware support.",
  },
  {
    title: "Writing support",
    description:
      "Prepare for short and extended writing tasks with useful structures and revision prompts.",
  },
];

export default function PastPapersPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Past Papers"
        description="Prepare for exam-style work with structured revision and future practice tools."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="file">
                Exam practice
              </Badge>
              <Badge tone="muted" icon="school">
                GCSE Russian
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Get ready for the real exam</h2>
              <p className="app-subtitle max-w-2xl">
                This area can become the home for past papers, exam-style tasks, revision
                guidance, and structured preparation before mocks and final exams.
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

          <DashboardCard title="Planned use">
            <div className="space-y-3">
              <p>
                This section is especially useful for self-study students who want more
                structured exam preparation, and it also fits well alongside your future
                mock exam offering.
              </p>

              <ul className="space-y-2">
                <li>• Exam-style paper navigation</li>
                <li>• Skill-based practice areas</li>
                <li>• Revision support before mocks</li>
                <li>• Future downloadable resources</li>
              </ul>
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {paperAreas.map((area) => (
          <DashboardCard key={area.title} title={area.title}>
            <p>{area.description}</p>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="Next build idea">
          <div className="space-y-3">
            <p>
              A very strong next step would be a database-backed exam resource model, so
              papers, mock materials, and revision assets can be managed from the admin
              side like the rest of the platform.
            </p>

            <ul className="space-y-2">
              <li>• Past paper records</li>
              <li>• Skill tags and filters</li>
              <li>• Mark scheme links</li>
              <li>• Mock exam resources</li>
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="Keep revising">
          <div className="space-y-3">
            <p>
              Past paper work is strongest when combined with grammar and vocabulary
              revision.
            </p>

            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Review grammar
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
