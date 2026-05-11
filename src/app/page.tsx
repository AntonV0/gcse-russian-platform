import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardVariantLabel,
} from "@/lib/dashboard/learning-plan";
import type { AppIconKey } from "@/lib/shared/icons";

type HubCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
  tone?: "default" | "info" | "success" | "warning";
};

const signedInHubCards: HubCard[] = [
  {
    title: "Dashboard",
    description: "Pick up the next lesson, assignment, mock, or feedback item.",
    href: "/dashboard",
    label: "Open dashboard",
    icon: "dashboard",
    tone: "success",
  },
  {
    title: "Course path",
    description: "Browse Foundation, Higher, or Volna modules and continue lessons.",
    href: "/courses",
    label: "Open courses",
    icon: "courses",
  },
  {
    title: "Mock exams",
    description: "Start or resume GCSE-style platform mock attempts.",
    href: "/mock-exams",
    label: "Open mocks",
    icon: "mockExam",
  },
  {
    title: "Account and billing",
    description: "Check profile, access, plan, upgrade, and payment options.",
    href: "/account",
    label: "Open account",
    icon: "billing",
  },
];

const guestHubCards: HubCard[] = [
  {
    title: "Start a trial",
    description: "Create an account to choose a path, save progress, and try lessons.",
    href: "/signup",
    label: "Start trial",
    icon: "create",
    tone: "success",
  },
  {
    title: "Browse courses",
    description: "Preview how course paths, modules, and lessons are organised.",
    href: "/courses",
    label: "Open courses",
    icon: "courses",
  },
  {
    title: "Past papers",
    description: "Use official Pearson resource links without creating an account.",
    href: "/past-papers",
    label: "Open papers",
    icon: "pastPapers",
  },
  {
    title: "Vocabulary and grammar",
    description: "Browse public revision hubs before committing to a study route.",
    href: "/vocabulary",
    label: "Open vocabulary",
    icon: "vocabulary",
  },
];

function getHeroContent(isSignedIn: boolean) {
  if (isSignedIn) {
    return {
      eyebrow: "Platform hub",
      title: "Welcome back to GCSE Russian",
      description:
        "Use this hub to get back to the most useful part of the platform: dashboard, course path, mock exams, assignments, resources, and account settings.",
      primaryHref: "/dashboard",
      primaryLabel: "Open dashboard",
      primaryIcon: "dashboard" as const,
      secondaryHref: "/courses",
      secondaryLabel: "Browse courses",
      secondaryIcon: "courses" as const,
    };
  }

  return {
    eyebrow: "GCSE Russian platform",
    title: "Start from the right GCSE Russian workspace",
    description:
      "Preview resources, browse the course structure, or create a trial account when you want saved progress, lessons, mock exams, and a personal dashboard.",
    primaryHref: "/signup",
    primaryLabel: "Start trial",
    primaryIcon: "create" as const,
    secondaryHref: "/courses",
    secondaryLabel: "Browse courses",
    secondaryIcon: "courses" as const,
  };
}

function HubCardGrid({ cards }: { cards: HubCard[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => (
        <DashboardCard key={item.title} className="h-full">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={19} />
              </span>
              {item.tone ? (
                <Badge tone={item.tone} icon={item.icon}>
                  Recommended
                </Badge>
              ) : null}
            </div>

            <div>
              <h2 className="app-heading-card">{item.title}</h2>
              <p className="mt-2 app-text-body-muted">{item.description}</p>
            </div>

            <Button
              href={item.href}
              variant={item.tone === "success" ? "journey" : "secondary"}
              size="sm"
              icon={item.icon}
            >
              {item.label}
            </Button>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}

export default async function AppHomePage() {
  const [user, dashboard] = await Promise.all([getCurrentUser(), getDashboardInfo()]);
  const isSignedIn = Boolean(user);
  const hero = getHeroContent(isSignedIn);
  const hubCards = isSignedIn ? signedInHubCards : guestHubCards;

  return (
    <AppShell
      user={
        user
          ? {
              email: user.email,
              variant: dashboard.variant,
            }
          : null
      }
    >
      <PageContainer>
        <div className="space-y-8 py-8 md:py-12">
          <PageIntroPanel
            tone="brand"
            eyebrow={hero.eyebrow}
            title={hero.title}
            description={hero.description}
            badges={
              <>
                <Badge tone="info" icon="school">
                  Edexcel GCSE 1RU0
                </Badge>
                <Badge tone="muted" icon="layers">
                  {getDashboardVariantLabel(dashboard.variant)}
                </Badge>
                <Badge
                  tone={isSignedIn ? "success" : "muted"}
                  icon={isSignedIn ? "userCheck" : "preview"}
                >
                  {isSignedIn
                    ? getDashboardAccessLabel(dashboard.accessMode)
                    : "Preview mode"}
                </Badge>
              </>
            }
            actions={
              <>
                <Button href={hero.primaryHref} variant="journey" icon={hero.primaryIcon}>
                  {hero.primaryLabel}
                </Button>
                <Button
                  href={hero.secondaryHref}
                  variant="secondary"
                  icon={hero.secondaryIcon}
                >
                  {hero.secondaryLabel}
                </Button>
              </>
            }
            visual={
              <VisualPlaceholder
                category="learningPath"
                size="wide"
                ariaLabel="GCSE Russian platform hub illustration"
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryStatCard
                title="Courses"
                value="Paths"
                description="Foundation, Higher, and Volna routes"
                icon="courses"
                compact
              />
              <SummaryStatCard
                title="Resources"
                value="Open"
                description="Vocabulary, grammar, papers"
                icon="pastPapers"
                compact
              />
              <SummaryStatCard
                title="Practice"
                value="Mocks"
                description="Account-based mock exams"
                icon="mockExam"
                compact
              />
              <SummaryStatCard
                title="Progress"
                value={isSignedIn ? "Saved" : "Trial"}
                description={
                  isSignedIn ? "continue from dashboard" : "create account to save"
                }
                icon="completed"
                tone={isSignedIn ? "success" : "brand"}
                compact
              />
            </div>
          </PageIntroPanel>

          {!isSignedIn ? (
            <FeedbackBanner
              tone="info"
              title="Past papers and resource previews stay open"
              description="You can browse revision resources first. Create a trial account when you want saved lesson progress, mock attempts, and a personal dashboard."
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  href="/past-papers"
                  variant="secondary"
                  size="sm"
                  icon="pastPapers"
                >
                  Past papers
                </Button>
                <Button href="/grammar" variant="secondary" size="sm" icon="grammar">
                  Grammar
                </Button>
                <Button href="/login" variant="secondary" size="sm" icon="user">
                  Log in
                </Button>
              </div>
            </FeedbackBanner>
          ) : null}

          <HubCardGrid cards={hubCards} />

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <DashboardCard title="Main learning route">
              <div className="space-y-4">
                <p>
                  The dashboard is the main launch point once you are signed in. It can
                  surface lessons, assignments, mocks, feedback, and account-specific next
                  steps without making you hunt through the app.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="/dashboard" variant="primary" icon="dashboard">
                    Open dashboard
                  </Button>
                  <Button href="/progress" variant="secondary" icon="completed">
                    Progress
                  </Button>
                  <Button href="/account/billing" variant="secondary" icon="billing">
                    Billing
                  </Button>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Revision shortcuts">
              <div className="grid gap-2">
                {[
                  {
                    href: "/vocabulary",
                    label: "Vocabulary",
                    icon: "vocabulary" as const,
                  },
                  { href: "/grammar", label: "Grammar", icon: "grammar" as const },
                  {
                    href: "/exam-calendar",
                    label: "Exam calendar",
                    icon: "calendar" as const,
                  },
                  {
                    href: "/taking-your-exams",
                    label: "Taking your exams",
                    icon: "exam" as const,
                  },
                ].map((item) => (
                  <Button
                    key={item.href}
                    href={item.href}
                    variant="secondary"
                    size="sm"
                    icon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </DashboardCard>
          </section>
        </div>
      </PageContainer>
    </AppShell>
  );
}
