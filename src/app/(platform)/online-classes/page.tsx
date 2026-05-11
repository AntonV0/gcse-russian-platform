import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

const decisionStats = [
  {
    title: "Teaching format",
    value: "Live",
    description: "Online GCSE Russian lessons with a teacher-led weekly rhythm.",
    icon: "school" as const,
    tone: "brand" as const,
  },
  {
    title: "Best for",
    value: "Support",
    description: "Students who need speaking practice, writing feedback, and accountability.",
    icon: "speaking" as const,
    tone: "info" as const,
  },
  {
    title: "Platform role",
    value: "Practice",
    description: "Use the course platform between lessons for revision and assignments.",
    icon: "assignments" as const,
    tone: "success" as const,
  },
  {
    title: "Cost guide",
    value: "Ask",
    description: "Confirm current group, 1:1, trial, and term fees with Volna before booking.",
    icon: "pricing" as const,
    tone: "warning" as const,
  },
];

const fitSignals = [
  "The student is preparing for Pearson Edexcel GCSE Russian and wants a teacher-led route.",
  "Speaking and writing need regular correction, not just independent practice.",
  "The family wants weekly accountability while exam entry is arranged separately.",
  "Self-study is useful, but the student needs help turning knowledge into exam answers.",
];

const lessonRhythm = [
  {
    title: "Before class",
    description:
      "Use the platform to revise vocabulary, grammar, listening, reading, and assigned preparation.",
  },
  {
    title: "During class",
    description:
      "Work through GCSE Russian skills with a teacher: explanation, speaking practice, writing improvement, and exam technique.",
  },
  {
    title: "After class",
    description:
      "Complete assignments, revisit mistakes, and bring questions back to the next lesson cycle.",
  },
];

const platformConnections = [
  "Course content gives students a study spine between live lessons.",
  "Assignments can turn teacher guidance into a concrete task with a submission deadline.",
  "Past papers, mock-style practice, and exam resources support revision outside class.",
  "Dashboard progress helps students keep the next step visible rather than guessing what to do.",
];

const volnaStudentWorkflow = [
  {
    title: "Check assignments first",
    description:
      "Your teacher may use assignments to set homework, request speaking or writing work, and keep your next action clear.",
  },
  {
    title: "Use feedback as the lesson bridge",
    description:
      "Teacher comments should feed into the next practice session, especially repeated grammar, pronunciation, and writing issues.",
  },
  {
    title: "Bring class questions back here",
    description:
      "If a live lesson exposes a weak topic, use the platform resources to practise it before the next class.",
  },
];

const nextSteps = [
  {
    title: "Visit Volna",
    description:
      "Use this when you want live lesson availability, current pricing, teacher support, and joining details.",
    href: "https://volnaschool.com",
    label: "Visit Volna",
    icon: "externalLink" as const,
    variant: "primary" as const,
    external: true,
  },
  {
    title: "Compare self-study",
    description:
      "Use this if the student may be able to work independently with structured course resources first.",
    href: "/courses",
    label: "Compare self-study",
    icon: "courses" as const,
    variant: "secondary" as const,
  },
  {
    title: "Back to dashboard",
    description:
      "Return to the student workspace for assignments, course progress, and the next platform task.",
    href: "/dashboard",
    label: "Back to dashboard",
    icon: "dashboard" as const,
    variant: "quiet" as const,
  },
];

export default async function OnlineClassesPage() {
  const user = await getCurrentUser();
  const dashboard = await getDashboardInfo();

  const isVolnaStudent = dashboard.role === "student" && dashboard.accessMode === "volna";

  return (
    <main className="space-y-8">
      <PageIntroPanel
        eyebrow="Online classes"
        title={isVolnaStudent ? "Your Volna lesson support" : "Choose Volna GCSE Russian support"}
        description={
          isVolnaStudent
            ? "Use this page as a bridge between live lessons and the platform: assignments, teacher feedback, course practice, and class questions should work together."
            : "Volna is the teacher-led route for GCSE Russian students who want live online lessons alongside the platform, especially for speaking, writing, grammar, and accountability."
        }
        tone="student"
        badges={
          <>
            <Badge tone="info" icon="school">
              Volna GCSE Russian
            </Badge>
            <Badge tone="muted" icon="speaking">
              Speaking and writing support
            </Badge>
            {user ? (
              <Badge tone={isVolnaStudent ? "success" : "muted"} icon="userCheck">
                {isVolnaStudent ? "Volna student" : "Student account"}
              </Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button
              href="https://volnaschool.com"
              target="_blank"
              rel="noreferrer"
              variant="primary"
              icon="externalLink"
            >
              Visit Volna
            </Button>
            <Button href="/courses" variant="secondary" icon="courses">
              Compare self-study
            </Button>
            <Button href="/dashboard" variant="quiet" icon="dashboard">
              Back to dashboard
            </Button>
          </>
        }
        visual={
          <VisualPlaceholder
            category="school"
            size="wide"
            ariaLabel="Volna online class support"
          />
        }
      >
        <FeedbackBanner
          tone={isVolnaStudent ? "success" : "info"}
          title={isVolnaStudent ? "Make the teacher workflow visible" : "Live lessons and platform access are separate choices"}
          description={
            isVolnaStudent
              ? "Start with your assignments, use teacher feedback to choose the next practice task, and bring platform questions back into class support."
              : "Some students can self-study effectively. Volna is worth considering when a student needs regular teacher explanation, speaking practice, writing correction, or a weekly routine."
          }
        />
      </PageIntroPanel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {decisionStats.map((stat) => (
          <SummaryStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            tone={stat.tone}
            compact
          />
        ))}
      </section>

      {isVolnaStudent ? (
        <section>
          <div className="mb-4">
            <h2 className="app-heading-section">Your Volna workflow</h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Treat the platform as the place where live teaching becomes concrete:
              assignments, feedback, revision, and the next question for class.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {volnaStudentWorkflow.map((item) => (
              <DashboardCard key={item.title} title={item.title}>
                <p>{item.description}</p>
              </DashboardCard>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="mb-4">
            <h2 className="app-heading-section">Who Volna is for</h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Use these checks to decide whether live online classes are the right next
              layer, or whether self-study is enough for now.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {fitSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
              >
                {signal}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <DashboardCard title="Lesson rhythm">
          <div className="space-y-4">
            <p>
              Volna works best when lessons are not isolated events. The platform gives
              students something to prepare, practise, and revisit between live sessions.
            </p>

            <div className="grid gap-3">
              {lessonRhythm.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-[var(--background-muted)] px-4 py-3"
                >
                  <div className="font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </div>
                  <p className="mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Cost guide and questions to ask">
          <div className="space-y-3">
            <p>
              Before committing, ask Volna for the current GCSE Russian lesson options,
              fees, timetable, group size, teacher availability, and whether a trial or
              short intensive route is available.
            </p>
            <p>
              Also confirm what is included: live teaching, homework, speaking practice,
              writing feedback, assignment marking, and support with private-candidate
              planning.
            </p>
            <FeedbackBanner
              tone="warning"
              title="Exam entry is still separate"
              description="Volna can support preparation, but families must confirm exam entry, tier, fees, deadlines, and speaking arrangements with their chosen exam centre."
            />
          </div>
        </DashboardCard>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="app-heading-section">How it works with the platform</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            The platform should reduce guesswork between classes, not replace the teacher.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformConnections.map((connection) => (
            <DashboardCard key={connection}>
              <p>{connection}</p>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="app-heading-section">Next steps</h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Choose the route that matches the student&apos;s current need.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step) => (
            <DashboardCard key={step.title} title={step.title}>
              <div className="space-y-4">
                <p>{step.description}</p>
                <Button
                  href={step.href}
                  target={step.external ? "_blank" : undefined}
                  rel={step.external ? "noreferrer" : undefined}
                  variant={step.variant}
                  size="sm"
                  icon={step.icon}
                >
                  {step.label}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>
    </main>
  );
}
