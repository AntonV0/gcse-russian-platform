import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import AppearancePreferenceSync from "@/components/providers/appearance-preference-sync";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import PublicAccentOverride from "@/components/providers/public-accent-override";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import {
  getCurrentAppearancePreferences,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardVariantLabel,
} from "@/lib/dashboard/learning-plan";
import { getPlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";
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
    title: "Start free",
    description:
      "Create your trial student account to try lessons, practice questions, and saved progress.",
    href: "/signup",
    label: "Start free trial",
    icon: "create",
    tone: "success",
  },
  {
    title: "My Course",
    description:
      "See how Foundation, Higher, and Volna learning routes are organised before you sign up.",
    href: "/courses",
    label: "Explore course",
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
    title: "Mock exams",
    description:
      "Preview the exam practice area, then create an account when you are ready to save attempts.",
    href: "/mock-exams",
    label: "Preview mocks",
    icon: "mockExam",
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
    eyebrow: "Guest app preview",
    title: "Explore GCSE Russian",
    description:
      "Look around the app before you create an account. Browse the course structure, past papers, mock exam previews, and tuition options, then start a free trial for lessons, practice questions, saved progress, and much more.",
    primaryHref: "/signup",
    primaryLabel: "Start free trial",
    primaryIcon: "create" as const,
    secondaryHref: "/courses",
    secondaryLabel: "Explore My Course",
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
  const [user, dashboard, profile, appearancePreferences] = await Promise.all([
    getCurrentUser(),
    getDashboardInfo(),
    getCurrentProfile(),
    getCurrentAppearancePreferences(),
  ]);
  const isSignedIn = Boolean(user);
  const hero = getHeroContent(isSignedIn);
  const hubCards = isSignedIn ? signedInHubCards : guestHubCards;
  const sidebarNextUp = await getPlatformSidebarNextUp(dashboard);

  const appHome = (
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
        <div className="grid gap-6 py-8 md:py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-[var(--sticky-site-offset)] lg:max-h-[calc(100dvh_-_var(--sticky-site-offset)_-_1rem)] lg:self-start">
            <PlatformSidebar
              role={dashboard.role}
              accessMode={dashboard.accessMode}
              variant={dashboard.variant}
              userEmail={user?.email}
              userDisplayName={profile?.display_name || profile?.full_name}
              userAvatarKey={profile?.avatar_key}
              userAvatarBackgroundKey={profile?.avatar_background_key}
              userAvatarFrameKey={profile?.equipped_avatar_frame_key}
              nextUp={sidebarNextUp}
            />
          </div>

          <section className="min-w-0">
            <div className="space-y-8">
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
                        : "Guest preview"}
                    </Badge>
                  </>
                }
                actions={
                  <>
                    <Button
                      href={hero.primaryHref}
                      variant="journey"
                      icon={hero.primaryIcon}
                    >
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
                  isSignedIn ? (
                    <VisualPlaceholder
                      category="learningPath"
                      size="wide"
                      ariaLabel="GCSE Russian platform hub illustration"
                    />
                  ) : undefined
                }
              >
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                  <SummaryStatCard
                    title="Courses"
                    value="Open"
                    description="Foundation, Higher, and Volna routes"
                    icon="courses"
                    compact
                  />
                  <SummaryStatCard
                    title="Resources"
                    value={isSignedIn ? "Open" : "Preview"}
                    description={
                      isSignedIn ? "revision and papers" : "papers and course view"
                    }
                    icon="pastPapers"
                    compact
                  />
                  <SummaryStatCard
                    title="Practice"
                    value="Mocks"
                    description={
                      isSignedIn ? "attempts and review" : "preview exam practice"
                    }
                    icon="mockExam"
                    compact
                  />
                  <SummaryStatCard
                    title="Progress"
                    value={isSignedIn ? "Saved" : "Trial"}
                    description={
                      isSignedIn ? "continue from dashboard" : "start free to save"
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
                  title="Create a free trial when you are ready to learn"
                  description="Guests can look around first. Your trial student account unlocks lessons, quizzes, practice questions, saved progress, and the personal dashboard."
                >
                  <div className="flex flex-wrap gap-2">
                    <Button href="/signup" variant="primary" size="sm" icon="create">
                      Start free trial
                    </Button>
                    <Button
                      href="/past-papers"
                      variant="secondary"
                      size="sm"
                      icon="pastPapers"
                    >
                      Past papers
                    </Button>
                    <Button href="/login" variant="secondary" size="sm" icon="user">
                      Log in
                    </Button>
                  </div>
                </FeedbackBanner>
              ) : null}

              <HubCardGrid cards={hubCards} />

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <DashboardCard
                  title={isSignedIn ? "Main learning route" : "What the trial unlocks"}
                >
                  <div className="space-y-4">
                    <p>
                      {isSignedIn
                        ? "The dashboard is the main launch point once you are signed in. It can surface lessons, assignments, mocks, feedback, and account-specific next steps without making you hunt through the app."
                        : "The free trial turns the preview into a real student workspace: lessons, quizzes, practice questions, mock exam attempts, and saved progress all start from your dashboard."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        href={isSignedIn ? "/dashboard" : "/signup"}
                        variant="primary"
                        icon={isSignedIn ? "dashboard" : "create"}
                      >
                        {isSignedIn ? "Open dashboard" : "Start free trial"}
                      </Button>
                      <Button
                        href={isSignedIn ? "/progress" : "/courses"}
                        variant="secondary"
                        icon={isSignedIn ? "completed" : "courses"}
                      >
                        {isSignedIn ? "Progress" : "Explore My Course"}
                      </Button>
                      <Button
                        href={isSignedIn ? "/account/billing" : "/online-classes"}
                        variant="secondary"
                        icon={isSignedIn ? "billing" : "school"}
                      >
                        {isSignedIn ? "Billing" : "Live classes and tuition"}
                      </Button>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title={isSignedIn ? "Revision shortcuts" : "Open to guests"}
                >
                  <div className="grid gap-2">
                    {(isSignedIn
                      ? [
                          {
                            href: "/vocabulary",
                            label: "Vocabulary",
                            icon: "vocabulary" as const,
                          },
                          {
                            href: "/grammar",
                            label: "Grammar",
                            icon: "grammar" as const,
                          },
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
                        ]
                      : [
                          {
                            href: "/courses",
                            label: "My Course",
                            icon: "courses" as const,
                          },
                          {
                            href: "/past-papers",
                            label: "Past papers",
                            icon: "pastPapers" as const,
                          },
                          {
                            href: "/mock-exams",
                            label: "Mock exams",
                            icon: "mockExam" as const,
                          },
                          {
                            href: "/online-classes",
                            label: "Live classes and tuition",
                            icon: "school" as const,
                          },
                        ]
                    ).map((item) => (
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
          </section>
        </div>
      </PageContainer>
    </AppShell>
  );

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppearancePreferenceSync
        themePreference={appearancePreferences?.theme_preference}
        accentPreference={appearancePreferences?.accent_preference}
      />
      {isSignedIn ? (
        appHome
      ) : (
        <div data-accent="blue">
          <PublicAccentOverride />
          {appHome}
        </div>
      )}
    </DevMarkerProvider>
  );
}
