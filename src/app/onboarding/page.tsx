import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { chooseTrialTierAction } from "@/app/actions/access/trial-access-actions";
import {
  saveOnboardingProfileAction,
  skipOnboardingProfileAction,
} from "@/app/actions/onboarding/onboarding-actions";
import StudentAvatar from "@/components/profile/student-avatar";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import LoadingButton from "@/components/ui/loading-button";
import {
  avatarBackgroundOptions,
  getSafeAvatarBackgroundKey,
  profileAvatarOptions,
} from "@/lib/profile/avatar-customization";
import {
  getCurrentAppearancePreferences,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type OnboardingPageProps = {
  searchParams?: Promise<{
    step?: string;
    error?: string;
  }>;
};

const tierOptions = [
  {
    tier: "higher",
    label: "Higher Tier",
    badge: "Grades 7-9 possible",
    title: "I want the route that keeps the top grades open",
    description:
      "Choose Higher if you already know some Russian or want the more ambitious GCSE route.",
    tone: "info",
  },
  {
    tier: "foundation",
    label: "Foundation Tier",
    badge: "More supported start",
    title: "I want the gentler route first",
    description:
      "Choose Foundation if Russian is very new and you want a slower, more scaffolded start.",
    tone: "success",
  },
] as const;

const accentOptions = [
  { key: "blue", label: "Blue" },
  { key: "purple", label: "Purple" },
  { key: "pink", label: "Pink" },
  { key: "red", label: "Red" },
  { key: "orange", label: "Orange" },
  { key: "yellow", label: "Yellow" },
  { key: "green", label: "Green" },
  { key: "teal", label: "Teal" },
  { key: "brown", label: "Brown" },
  { key: "slate", label: "Slate" },
] as const;

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "Student";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function OnboardingShell({
  children,
  showDashboardLink = false,
}: {
  children: React.ReactNode;
  showDashboardLink?: boolean;
}) {
  return (
    <div data-accent="blue" className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
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
          {showDashboardLink ? (
            <Button href="/dashboard" variant="quiet" size="sm" icon="dashboard">
              Skip to dashboard
            </Button>
          ) : null}
        </div>

        {children}
      </main>
    </div>
  );
}

function TierStep() {
  return (
    <OnboardingShell>
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
            Pick the route that should shape your dashboard first. You can still review
            access options later from inside the app.
          </p>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-3">
          {tierOptions.map((option) => (
            <form
              key={option.tier}
              action={chooseTrialTierAction}
              className="flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/55 p-4"
            >
              <input type="hidden" name="source" value="onboarding" />
              <input type="hidden" name="tier" value={option.tier} />
              <div className="flex flex-wrap gap-2">
                <Badge tone={option.tone} icon="layers">
                  {option.label}
                </Badge>
                <Badge tone="muted">{option.badge}</Badge>
              </div>
              <h2 className="mt-4 app-heading-subsection">{option.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
                {option.description}
              </p>
              <div className="mt-5">
                <LoadingButton
                  idleLabel={`Start ${option.label} trial`}
                  pendingLabel={`Starting ${option.label} trial...`}
                  idleIcon="next"
                  iconPosition="right"
                  variant={option.tier === "higher" ? "primary" : "secondary"}
                />
              </div>
            </form>
          ))}

          <section className="flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/55 p-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                Volna School
              </Badge>
              <Badge tone="muted">Live teaching</Badge>
            </div>
            <h2 className="mt-4 app-heading-subsection">
              I am interested in live lessons
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
              Volna School is arranged separately from self-study trial access. Open the
              live classes page in a new tab if you want to compare that route.
            </p>
            <div className="mt-5">
              <Button
                href="/online-classes"
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                icon="externalLink"
              >
                Open Volna information
              </Button>
            </div>
          </section>
        </div>
      </section>
    </OnboardingShell>
  );
}

function ProfileStep({
  profile,
  email,
  appearancePreferences,
  error,
}: {
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  email?: string | null;
  appearancePreferences: Awaited<ReturnType<typeof getCurrentAppearancePreferences>>;
  error?: string;
}) {
  const selectedAvatarKey = profile?.avatar_key ?? "";
  const selectedBackgroundKey = getSafeAvatarBackgroundKey(
    profile?.avatar_background_key
  );
  const initials = getInitials(profile?.display_name || profile?.full_name, email);
  const avatarOptions = profileAvatarOptions.slice(0, 8);
  const backgroundOptions = avatarBackgroundOptions.slice(0, 8);

  return (
    <OnboardingShell showDashboardLink>
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
            This is optional. Choose a display name, avatar, and colour theme now, or
            skip and update them later from Profile and Settings.
          </p>
        </div>

        <form action={saveOnboardingProfileAction} className="px-5 py-5 sm:px-6">
          {error ? (
            <FeedbackBanner
              tone="danger"
              title="Profile setup was not saved"
              description={
                error === "avatar"
                  ? "Choose a valid avatar before saving."
                  : decodeURIComponent(error)
              }
              className="mb-5"
            />
          ) : null}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-5">
              <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
                <label htmlFor="displayName" className="app-form-label">
                  Display name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  maxLength={50}
                  defaultValue={profile?.display_name ?? ""}
                  placeholder={profile?.full_name ?? "Student"}
                  className="app-form-control app-form-input mt-2"
                />
              </section>

              <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
                <h2 className="app-heading-subsection">Choose an avatar</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {avatarOptions.map((avatar) => (
                    <label
                      key={avatar.key || "initials"}
                      className="cursor-pointer rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--accent-selected-border)]"
                    >
                      <input
                        type="radio"
                        name="avatarKey"
                        value={avatar.key}
                        defaultChecked={avatar.key === selectedAvatarKey}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-3">
                        <StudentAvatar
                          avatar={avatar}
                          initials={initials}
                          backgroundKey={selectedBackgroundKey}
                          size="sm"
                        />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {avatar.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
                <h2 className="app-heading-subsection">Avatar background</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {backgroundOptions.map((background) => (
                    <label
                      key={background.key}
                      className="cursor-pointer rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--accent-selected-border)]"
                    >
                      <input
                        type="radio"
                        name="avatarBackgroundKey"
                        value={background.key}
                        defaultChecked={background.key === selectedBackgroundKey}
                        className="sr-only"
                      />
                      <span className="flex items-center gap-3">
                        <span
                          className="h-7 w-7 rounded-full border border-white/70 shadow-[0_0_0_1px_color-mix(in_srgb,var(--text-primary)_10%,transparent)]"
                          style={{ background: background.background }}
                        />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {background.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
                <h2 className="app-heading-subsection">Theme</h2>
                <div className="mt-4 grid gap-2">
                  {(["system", "light", "dark"] as const).map((theme) => (
                    <label key={theme} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="themePreference"
                        value={theme}
                        defaultChecked={
                          (appearancePreferences?.theme_preference ?? "system") === theme
                        }
                        className="accent-[var(--accent-fill)]"
                      />
                      <span className="capitalize text-[var(--text-secondary)]">
                        {theme}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4">
                <h2 className="app-heading-subsection">Accent colour</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {accentOptions.map((accent) => (
                    <label key={accent.key} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="accentPreference"
                        value={accent.key}
                        defaultChecked={
                          (appearancePreferences?.accent_preference ?? "blue") ===
                          accent.key
                        }
                        className="accent-[var(--accent-fill)]"
                      />
                      <span className="text-[var(--text-secondary)]">{accent.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
                <div className="flex flex-col gap-3">
                  <LoadingButton
                    idleLabel="Save and continue"
                    pendingLabel="Saving setup..."
                    idleIcon="save"
                    variant="primary"
                  />
                  <Button
                    formAction={skipOnboardingProfileAction}
                    type="submit"
                    variant="secondary"
                    icon="next"
                    iconPosition="right"
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </OnboardingShell>
  );
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signup");
  }

  const query = (await searchParams) ?? {};
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
      redirect("/onboarding");
    }

    return (
      <ProfileStep
        profile={profile}
        email={user.email}
        appearancePreferences={appearancePreferences}
        error={query.error}
      />
    );
  }

  if (dashboard.accessState !== "trial_needs_tier") {
    redirect("/dashboard");
  }

  return <TierStep />;
}
