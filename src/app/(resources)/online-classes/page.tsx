import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import SectionCard from "@/components/ui/section-card";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { AppIconKey } from "@/lib/shared/icons";

const VOLNA_GCSE_URL = "https://www.volnaschool.com/gcse-courses";

export const metadata: Metadata = buildPublicMetadata({
  title: "Online GCSE Russian Lessons",
  description:
    "Explore Volna School live GCSE Russian lessons, homework, speaking practice, and how teacher-led support connects with the GCSE Russian platform.",
  path: "/online-classes",
  ogTitle: "Online GCSE Russian Lessons",
  ogDescription:
    "See how Volna School live teaching can support GCSE Russian study alongside the platform.",
  ogImagePath: getOgImagePath("lessons"),
});

const decisionPoints: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "teacher",
    title: "You want a teacher in the room",
    description:
      "Best for students who need explanations, correction, and someone to keep the GCSE route moving each week.",
  },
  {
    icon: "speaking",
    title: "Speaking needs live practice",
    description:
      "A teacher can rehearse role play, picture-based tasks, conversation answers, pronunciation, and follow-up questions.",
  },
  {
    icon: "assignments",
    title: "Homework helps you stay accountable",
    description:
      "Volna students get regular tasks, feedback, and a clearer study rhythm between live lessons.",
  },
];

const lessonRhythm = [
  "Two 1-hour online GCSE Russian lessons each week during teaching weeks.",
  "Small groups, so students can ask questions and receive direct feedback.",
  "Weekly homework to reinforce grammar, vocabulary, translation, and exam technique.",
  "Platform access supports lessons, assignments, revision resources, and progress.",
];

const platformConnections: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
  href: string;
  label: string;
}> = [
  {
    icon: "assignments",
    title: "Teacher-set assignments",
    description:
      "Volna students use the platform to receive homework, submit work, and review feedback.",
    href: "/assignments",
    label: "Open assignments",
  },
  {
    icon: "courses",
    title: "Course and revision resources",
    description:
      "Lessons, vocabulary, grammar, past papers, and mocks stay in the same GCSE Russian workspace.",
    href: "/courses",
    label: "Browse courses",
  },
  {
    icon: "dashboard",
    title: "Dashboard next steps",
    description:
      "The dashboard keeps the next useful action visible across self-study and Volna-linked learning.",
    href: "/dashboard",
    label: "Open dashboard",
  },
];

function VolnaStudentPanel() {
  return (
    <FeedbackBanner
      tone="success"
      icon="userCheck"
      title="You are already in the Volna student route"
      description="Use this page as a map of how live teaching connects to the platform. Your day-to-day work should continue through assignments, teacher feedback, and your dashboard next step."
    >
      <div className="flex flex-wrap gap-2">
        <Button href="/assignments" variant="primary" size="sm" icon="assignments">
          Open assignments
        </Button>
        <Button href="/dashboard" variant="secondary" size="sm" icon="dashboard">
          Dashboard
        </Button>
      </div>
    </FeedbackBanner>
  );
}

export default async function OnlineClassesPage() {
  const [user, dashboard] = await Promise.all([getCurrentUser(), getDashboardInfo()]);
  const isVolnaStudent = dashboard.role === "student" && dashboard.accessMode === "volna";

  return (
    <main>
      <LearningSheet>
      <LearningSheetHeader
        eyebrow="Volna live teaching"
        title={
          isVolnaStudent
            ? "Your Volna GCSE Russian route"
            : "Add live teaching to GCSE Russian"
        }
        description={
          isVolnaStudent
            ? "Your platform account is connected to Volna-style teacher support: live classes, assignments, feedback, and structured GCSE Russian study in one place."
            : "Volna School is the teacher-led route for families who want regular GCSE Russian lessons, weekly homework, speaking practice, and accountability alongside the platform."
        }
        badges={
          <>
            <Badge tone="info" icon="school">
              Volna School
            </Badge>
            <Badge tone="muted" icon="calendar">
              2 lessons per week
            </Badge>
            <Badge
              tone={isVolnaStudent ? "success" : "muted"}
              icon={isVolnaStudent ? "userCheck" : "student"}
            >
              {isVolnaStudent
                ? "Volna student"
                : user
                  ? "Student account"
                  : "Open enquiry"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button
              href={VOLNA_GCSE_URL}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              icon="school"
            >
              Visit Volna
            </Button>
            <Button href="/pricing" variant="secondary" icon="pricing">
              Compare self-study
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Back to dashboard
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryStatCard
            title="Live teaching"
            value="2x"
            description="1-hour lessons each week"
            icon="teacher"
            tone="brand"
            compact
          />
          <SummaryStatCard
            title="Cost guide"
            value="£18"
            description="per teaching hour"
            icon="pricing"
            tone="info"
            compact
          />
          <SummaryStatCard
            title="Best fit"
            value="Guided"
            description="teaching, feedback, homework"
            icon="learning"
            tone="success"
            compact
          />
        </div>
      </LearningSheetHeader>

      {isVolnaStudent ? (
        <LearningSheetSection muted>
          <VolnaStudentPanel />
        </LearningSheetSection>
      ) : null}

      <LearningSheetSection>
        <div className="grid gap-4 md:grid-cols-3">
        {decisionPoints.map((item) => (
          <DashboardCard key={item.title} className="h-full">
            <div className="space-y-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </span>
              <div>
                <h2 className="app-heading-card">{item.title}</h2>
                <p className="mt-2 app-text-body-muted">{item.description}</p>
              </div>
            </div>
          </DashboardCard>
        ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <SectionCard
          title="Typical Volna lesson rhythm"
          description="The live route is for students who benefit from structure, teacher correction, and a weekly study routine."
          tone="student"
        >
          <div className="grid gap-3">
            {lessonRhythm.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-sm font-semibold text-[var(--accent-ink)]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Cost and commitment"
          description="Use this as a planning guide before checking current availability with Volna School."
          tone="brand"
        >
          <div className="space-y-4">
            <div className="app-soft-panel p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
                Group class guide
              </div>
              <div className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                £36 per teaching week
              </div>
              <p className="mt-2 app-text-body-muted">
                Based on two 1-hour weekly lessons at £18 per hour. Volna normally
                invoices by school term after the first free lesson.
              </p>
            </div>

            <FeedbackBanner
              tone="info"
              title="Self-study is still the lower-cost route"
              description="Choose self-study if you mainly need structured lessons and revision tools. Choose Volna if live teaching and accountability matter more."
            />
          </div>
        </SectionCard>
        </div>
      </LearningSheetSection>

      <LearningSheetSection>
        <div className="mb-4">
          <h2 className="app-heading-section">
            How live teaching connects to the platform
          </h2>
          <p className="mt-2 max-w-2xl app-text-body-muted">
            Volna support should feel like an extension of the app, not a separate maze.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {platformConnections.map((item) => (
            <DashboardCard key={item.title} className="h-full">
              <div className="space-y-4">
                <Badge tone="muted" icon={item.icon}>
                  {item.title}
                </Badge>
                <p className="app-text-body-muted">{item.description}</p>
                <Button href={item.href} variant="secondary" size="sm" icon={item.icon}>
                  {item.label}
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </LearningSheetSection>

      <LearningSheetSection muted>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
        <DashboardCard title="Next steps">
          <div className="space-y-4">
            <p>
              If live teaching sounds right, check the current GCSE Russian class route
              with Volna School. If you are not ready for that commitment, compare the
              self-study course plans first.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                href={VOLNA_GCSE_URL}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                icon="externalLink"
              >
                Visit Volna
              </Button>
              <Button href="/pricing" variant="secondary" icon="pricing">
                Compare self-study
              </Button>
              <Button href="/courses" variant="secondary" icon="courses">
                Browse courses
              </Button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Already enrolled?">
          <div className="space-y-3">
            <p>
              Your main Volna workflow lives in assignments, feedback, and dashboard next
              actions.
            </p>
            <Button href="/assignments" variant="secondary" size="sm" icon="assignments">
              Open assignments
            </Button>
          </div>
        </DashboardCard>
        </div>
      </LearningSheetSection>
      </LearningSheet>
    </main>
  );
}
