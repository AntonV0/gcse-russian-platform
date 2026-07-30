import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OnboardingEventTracker from "@/components/onboarding/onboarding-event-tracker";
import OnboardingProfileCustomizer from "@/components/onboarding/onboarding-profile-customizer";
import TrialPathSelector from "@/components/onboarding/trial-path-selector";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import FeedbackBanner from "@/components/ui/feedback-banner";
import {
  getCurrentAppearancePreferences,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getSafeAvatarBackgroundKey } from "@/lib/profile/avatar-customization";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type OnboardingPageProps = {
  searchParams?: Promise<{
    step?: string;
    error?: string;
    next?: string;
  }>;
};

const tierErrorMessages: Record<string, string> = {
  "choose-tier": "Choose Foundation or Higher before continuing.",
  "trial-grant-check-failed":
    "We could not check your current course access. Try again in a moment.",
  "trial-product-missing":
    "That trial route is temporarily unavailable. Try the other route or contact support.",
  "trial-grant-failed":
    "We could not start the selected trial. Nothing was charged—please try again.",
};

function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-accent="blue" className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)]">
            <AppIcon icon="school" size={20} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[var(--text-primary)]">
              GCSE Russian
            </p>
            <p className="text-xs app-text-muted">Trial setup</p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

function TierStep({ error, nextPath }: { error?: string; nextPath: string }) {
  return (
    <OnboardingShell>
      <OnboardingEventTracker
        eventName="tier_viewed"
        destinationPath={nextPath}
        onlyExistingJourney
      />
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
        <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="success" icon="unlocked">
              Trial account ready
            </Badge>
            <Badge tone="muted" icon="layers">
              Step 1 of 2
            </Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[3rem]">
            Choose your trial path
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            Compare the two GCSE tiers, select one, then review the choice before
            continuing. You can revisit your route later from inside the app.
          </p>
        </div>

        {error ? (
          <div className="px-5 pt-5 sm:px-6">
            <FeedbackBanner
              tone="danger"
              title="Your trial path was not started"
              description={
                tierErrorMessages[error] ??
                "Something interrupted the tier choice. Please try again."
              }
            />
          </div>
        ) : null}

        <TrialPathSelector nextPath={nextPath} />
      </section>
    </OnboardingShell>
  );
}

function ProfileStep({
  profile,
  email,
  appearancePreferences,
  error,
  nextPath,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  email?: string | null;
  appearancePreferences: Awaited<ReturnType<typeof getCurrentAppearancePreferences>>;
  error?: string;
  nextPath: string;
}) {
  return (
    <OnboardingShell>
      <OnboardingEventTracker
        eventName="profile_viewed"
        destinationPath={nextPath}
        onlyExistingJourney
      />
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
        <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="success" icon="completed">
              Trial path selected
            </Badge>
            <Badge tone="muted" icon="palette">
              Step 2 of 2
            </Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[3rem]">
            Make the app feel like yours
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            This is optional. Preview a display name, avatar, and colour theme, or skip
            and update them later from Profile and Settings.
          </p>
        </div>

        <OnboardingProfileCustomizer
          email={email}
          fullName={profile?.full_name}
          initialDisplayName={profile?.display_name}
          initialAvatarKey={profile?.avatar_key ?? ""}
          initialBackgroundKey={getSafeAvatarBackgroundKey(
            profile?.avatar_background_key
          )}
          initialThemePreference={appearancePreferences?.theme_preference ?? "system"}
          initialAccentPreference={appearancePreferences?.accent_preference ?? "blue"}
          nextPath={nextPath}
          error={error}
        />
      </section>
    </OnboardingShell>
  );
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const query = (await searchParams) ?? {};
  const nextPath = getPostOnboardingRedirectPath(query.next);
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/signup?from=app&next=${encodeURIComponent(nextPath)}`);
  }

  const step = query.step === "profile" ? "profile" : "tier";
  const [dashboard, profile, appearancePreferences] = await Promise.all([
    getDashboardInfo(),
    getCurrentProfile(),
    getCurrentAppearancePreferences(),
  ]);

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    redirect("/dashboard");
  }

  const hasTrialPath =
    dashboard.role === "student" &&
    dashboard.accessMode === "trial" &&
    (dashboard.variant === "foundation" || dashboard.variant === "higher");

  if (step === "profile") {
    if (!hasTrialPath) {
      redirect(`/onboarding?next=${encodeURIComponent(nextPath)}`);
    }

    return (
      <ProfileStep
        profile={profile}
        email={user.email}
        appearancePreferences={appearancePreferences}
        error={query.error}
        nextPath={nextPath}
      />
    );
  }

  if (dashboard.accessState !== "trial_needs_tier") {
    redirect(nextPath);
  }

  return <TierStep error={query.error} nextPath={nextPath} />;
}
