import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

const classBenefits = [
  {
    title: "Live teacher guidance",
    description:
      "Study with an experienced teacher who can explain grammar, vocabulary, translation, and exam technique in real time.",
  },
  {
    title: "Structured GCSE preparation",
    description:
      "Follow a clear learning path designed around GCSE Russian success, with lessons that support revision and confidence.",
  },
  {
    title: "Small-group learning",
    description:
      "Benefit from a more focused learning environment where students can ask questions and get meaningful support.",
  },
  {
    title: "Support beyond lessons",
    description:
      "Online classes can complement self-study by adding accountability, direction, and expert feedback.",
  },
];

const classFeatures = [
  "Live online lessons",
  "GCSE-focused teaching",
  "Experienced Russian teachers",
  "Support with exam preparation",
  "Structured progression",
  "Suitable for learners who want more guidance",
];

export default async function OnlineClassesPage() {
  const user = await getCurrentUser();
  const dashboard = await getDashboardInfo();

  const isVolnaStudent = dashboard.role === "student" && dashboard.accessMode === "volna";

  return (
    <main className="space-y-8">
      <PageHeader
        title="Online Classes"
        description="Find out more about live GCSE Russian tuition through Volna School."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Live online tuition
              </Badge>

              <Badge tone="muted" icon="courses">
                GCSE Russian
              </Badge>

              {user ? (
                <Badge tone="muted" icon="userCheck">
                  {isVolnaStudent ? "Volna student" : "Student account"}
                </Badge>
              ) : null}
            </div>

            <div className="space-y-2">
              <h2 className="app-title">Learn with a live teacher</h2>
              <p className="app-subtitle max-w-2xl">
                Volna School’s online GCSE Russian classes can support students who want
                more structure, expert teaching, and a clearer path through the course.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="https://volnaschool.com" variant="primary" icon="school">
                Visit Volna School
              </Button>

              <Button href="/dashboard" variant="secondary" icon="dashboard">
                Back to dashboard
              </Button>

              <Button href="/courses" variant="secondary" icon="courses">
                Browse courses
              </Button>
            </div>
          </div>

          <DashboardCard title="Who this is for">
            <div className="space-y-3">
              {isVolnaStudent ? (
                <>
                  <p>
                    You are already using the Volna student experience inside the app, so
                    this page is mainly here as a reference point.
                  </p>
                  <p>
                    Your main live-teaching workflow continues through your lessons,
                    assignments, and guided study inside the platform.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This is a good fit for students who want live support rather than
                    relying only on self-study.
                  </p>
                  <p>
                    It can be especially helpful for learners who want accountability,
                    regular teaching, and more confidence before exams.
                  </p>
                </>
              )}
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classBenefits.map((benefit) => (
          <DashboardCard key={benefit.title} title={benefit.title}>
            <p>{benefit.description}</p>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <DashboardCard title="What students can expect">
          <div className="space-y-4">
            <p>
              Online classes can sit alongside the platform and give students a more
              guided learning experience, especially when they want direct teaching and
              regular support.
            </p>

            <ul className="grid gap-2 sm:grid-cols-2">
              {classFeatures.map((feature) => (
                <li
                  key={feature}
                  className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-primary)]"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard title="How it connects to the platform">
          <div className="space-y-3">
            <p>
              The app supports different student experiences inside one shared platform,
              so live tuition can complement self-study without needing a separate system.
            </p>

            <p>
              Students can use lessons, revision resources, and dashboard tools here, then
              move into more guided support through Volna School when needed.
            </p>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <DashboardCard title="Why choose live tuition?">
          <div className="space-y-3">
            <p>
              Some learners make strong progress independently, but others benefit much
              more from regular explanations, correction, and encouragement from a
              teacher.
            </p>

            <p>
              Live classes can help turn the platform into part of a wider learning system
              rather than the only source of support.
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Ready to find out more?">
          <div className="space-y-3">
            <p>
              Visit Volna School to learn more about the GCSE Russian class offering and
              next steps for joining.
            </p>

            <Link
              href="https://volnaschool.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              Go to Volna School
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
