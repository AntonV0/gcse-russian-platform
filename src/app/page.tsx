import Link from "next/link";
import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import AppearancePreferenceSync from "@/components/providers/appearance-preference-sync";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import PublicAccentOverride from "@/components/providers/public-accent-override";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import LearningSheet, { LearningSheetSection } from "@/components/ui/learning-sheet";
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

type HomeLinkItem = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
  tone?: "default" | "info" | "success" | "warning";
};

const signedInHomeLinks: HomeLinkItem[] = [
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

const guestHomeLinks: HomeLinkItem[] = [
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
    title: "Mock Exams",
    description:
      "Preview the exam practice area, then create an account when you are ready to save attempts.",
    href: "/mock-exams",
    label: "Preview mocks",
    icon: "mockExam",
  },
  {
    title: "Live Classes & Tuition",
    description:
      "See how Volna School support can sit alongside the self-study course.",
    href: "/online-classes",
    label: "View classes",
    icon: "school",
  },
];

const guestTrialUnlocks = [
  { title: "Lessons", description: "Try guided GCSE Russian lessons.", icon: "lessons" },
  {
    title: "Practice questions",
    description: "Use quizzes and question practice.",
    icon: "exercise",
  },
  {
    title: "Saved progress",
    description: "Keep lesson and revision progress.",
    icon: "completed",
  },
  {
    title: "Student dashboard",
    description: "Return to your next best step.",
    icon: "dashboard",
  },
] satisfies Array<{
  title: string;
  description: string;
  icon: AppIconKey;
}>;

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
    primaryHref: "/signup?from=app",
    primaryLabel: "Start free trial",
    primaryIcon: "create" as const,
    secondaryHref: "/courses",
    secondaryLabel: "Explore My Course",
    secondaryIcon: "courses" as const,
  };
}

function HomeLinkGrid({ items }: { items: HomeLinkItem[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group flex h-full min-h-[12rem] flex-col rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_88%,transparent)] p-4 transition app-focus-ring hover:border-[var(--sidebar-item-border-hover)] hover:bg-[var(--sidebar-item-bg-hover)] hover:shadow-[var(--shadow-md)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--accent-ink)] transition group-hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--background-elevated))]">
            <AppIcon icon={item.icon} size={18} />
          </span>

          <span className="mt-4 app-heading-card">{item.title}</span>
          <span className="mt-2 flex-1 app-text-body-muted">{item.description}</span>

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
            {item.label}
            <AppIcon
              icon="arrowRight"
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeFactStrip({
  isSignedIn,
  variantLabel,
  accessLabel,
}: {
  isSignedIn: boolean;
  variantLabel: string;
  accessLabel: string;
}) {
  const facts = [
    {
      title: "Course",
      value: "Open preview",
      description: "Foundation, Higher, and Volna routes",
      icon: "courses" as const,
    },
    {
      title: "Resources",
      value: isSignedIn ? "Open" : "Guest view",
      description: isSignedIn ? "revision and papers" : "papers and course view",
      icon: "pastPapers" as const,
    },
    {
      title: "Access",
      value: accessLabel,
      description: variantLabel,
      icon: isSignedIn ? ("userCheck" as const) : ("preview" as const),
    },
  ];

  return (
    <div className="grid overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_62%,transparent)] md:grid-cols-3">
      {facts.map((fact, index) => (
        <div
          key={fact.title}
          className={[
            "flex min-h-[6.5rem] gap-3 p-4",
            index > 0
              ? "border-t border-[var(--border-subtle)] md:border-l md:border-t-0"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
            <AppIcon icon={fact.icon} size={17} />
          </span>
          <span className="min-w-0">
            <span className="block app-text-caption">{fact.title}</span>
            <span className="mt-1 block font-semibold leading-tight text-[var(--text-primary)]">
              {fact.value}
            </span>
            <span className="mt-1 block app-text-caption">{fact.description}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function TrialUnlockGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {guestTrialUnlocks.map((item) => (
        <div
          key={item.title}
          className="flex h-full gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--accent-border-ink)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_74%,transparent)] p-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
            <AppIcon icon={item.icon} size={17} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-[var(--text-primary)]">
              {item.title}
            </span>
            <span className="mt-1 block app-text-caption">{item.description}</span>
          </span>
        </div>
      ))}
    </div>
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
  const homeLinks = isSignedIn ? signedInHomeLinks : guestHomeLinks;
  const variantLabel = getDashboardVariantLabel(dashboard.variant);
  const accessLabel = isSignedIn
    ? getDashboardAccessLabel(dashboard.accessMode)
    : "Guest preview";
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
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
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
            <LearningSheet>
              <LearningSheetSection divided={false} className="md:py-7">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                  <div className="min-w-0">
                    <div className="app-text-caption uppercase tracking-[0.12em]">
                      {hero.eyebrow}
                    </div>
                    <h1 className="mt-2 max-w-3xl text-[2.25rem] font-extrabold leading-[1.04] text-[var(--text-primary)] [letter-spacing:0] md:text-[3rem]">
                      {hero.title}
                    </h1>
                    <p className="mt-4 max-w-3xl app-text-lede">{hero.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge tone="info" icon="school">
                        Edexcel GCSE 1RU0
                      </Badge>
                      <Badge tone="muted" icon="layers">
                        {variantLabel}
                      </Badge>
                      <Badge
                        tone={isSignedIn ? "success" : "muted"}
                        icon={isSignedIn ? "userCheck" : "preview"}
                      >
                        {accessLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="app-mobile-action-stack flex shrink-0 flex-col gap-2 sm:flex-row xl:justify-end">
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
                  </div>
                </div>

                <div className="mt-6">
                  <HomeFactStrip
                    isSignedIn={isSignedIn}
                    variantLabel={variantLabel}
                    accessLabel={accessLabel}
                  />
                </div>
              </LearningSheetSection>

              <LearningSheetSection muted>
                {isSignedIn ? (
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <h2 className="app-card-title">Continue from your dashboard</h2>
                      <p className="mt-2 app-text-body-muted">
                        Your dashboard is the fastest route back to lessons, mocks,
                        assignments, and saved progress.
                      </p>
                    </div>
                    <Button href="/dashboard" variant="primary" icon="dashboard">
                      Open dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                      <div>
                        <h2 className="app-card-title">
                          Begin studying with a free trial account
                        </h2>
                        <p className="mt-2 max-w-3xl app-text-body-muted">
                          Guests can look around first. Your trial student account
                          unlocks lessons, quizzes, practice questions, saved progress,
                          and the personal dashboard.
                        </p>
                      </div>
                      <div className="app-mobile-action-stack flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          href="/signup?from=app"
                          variant="primary"
                          size="sm"
                          icon="create"
                        >
                          Start free trial
                        </Button>
                        <Button
                          href="/login?from=app"
                          variant="secondary"
                          size="sm"
                          icon="user"
                        >
                          Log in
                        </Button>
                      </div>
                    </div>

                    <TrialUnlockGrid />
                  </div>
                )}
              </LearningSheetSection>

              <LearningSheetSection>
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="app-card-title">
                      {isSignedIn ? "Open your main areas" : "Explore as a guest"}
                    </h2>
                    <p className="mt-2 max-w-2xl app-text-body-muted">
                      {isSignedIn
                        ? "Jump straight into the parts of the platform you are most likely to need next."
                        : "These areas are open before signup, so students and parents can understand the platform first."}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <HomeLinkGrid items={homeLinks} />
                </div>
              </LearningSheetSection>

              <LearningSheetSection>
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                  <div>
                    <h2 className="app-card-title">
                      {isSignedIn ? "Main learning route" : "What Home is for"}
                    </h2>
                    <p className="mt-2 app-text-body-muted">
                      {isSignedIn
                        ? "Home is a calm platform overview. Use the dashboard when you want personalised next steps and saved learning activity."
                        : "Home is the place to understand the platform before committing. Use Dashboard when you want to preview the personalised student workspace."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        href="/dashboard"
                        variant="secondary"
                        icon="dashboard"
                      >
                        {isSignedIn ? "Open dashboard" : "Preview dashboard"}
                      </Button>
                      <Button
                        href="/courses"
                        variant="secondary"
                        icon="courses"
                      >
                        Explore My Course
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
                    <h3 className="app-heading-card">
                      {isSignedIn ? "Useful shortcuts" : "Guest access boundary"}
                    </h3>
                    <p className="mt-2 app-text-body-muted">
                      {isSignedIn
                        ? "Progress, account tools, and study practice are available from the sidebar once you are signed in."
                        : "Vocabulary, grammar, progress, exam calendar, and exam admin guidance unlock through the trial path, while course preview, papers, mocks, and tuition information stay open."}
                    </p>
                  </div>
                </div>
              </LearningSheetSection>
            </LearningSheet>
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
