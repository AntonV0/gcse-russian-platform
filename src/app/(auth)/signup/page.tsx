import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import SignUpForm from "@/components/auth/signup-form";
import OnboardingEventTracker from "@/components/onboarding/onboarding-event-tracker";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "Create Your Trial Student Account",
    description:
      "Create a free GCSE Russian trial account to start lessons, practice questions, saved progress, and mock exam attempts.",
    path: "/signup",
  }),
  robots: noIndexRobots,
};

const unlocks = [
  "Choose Foundation or Higher",
  "Try lessons and practice questions",
  "Save progress and mock exam attempts",
  "Personalise your student profile",
];

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string; next?: string }>;
}) {
  const { error, from, next } = await searchParams;
  const signupSource = from === "app" ? "app" : "marketing";
  const signupPagePath = signupSource === "app" ? "/signup?from=app" : "/signup";
  const destinationPath = getPostOnboardingRedirectPath(next);
  const signupEntryPath = next
    ? getPostOnboardingRedirectPath(next, signupPagePath)
    : signupPagePath;

  return (
    <AuthShell
      source={from}
      activePage="signup"
      nextPath={destinationPath}
      backPath={destinationPath}
    >
      <OnboardingEventTracker
        eventName="signup_viewed"
        source={signupSource}
        entryPath={signupEntryPath}
        destinationPath={destinationPath}
      />
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-6 sm:px-7 md:py-7">
            <div className="flex flex-wrap gap-2">
              <Badge tone="success" icon="unlocked">
                Free trial
              </Badge>
              <Badge tone="info" icon="school">
                Pearson Edexcel 1RU0
              </Badge>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.58fr)] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[3rem]">
                  Create your trial student account
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                  Start learning GCSE Russian for free. After signup, choose Foundation or
                  Higher, try lessons and practice questions, and save your progress.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
                <div className="flex items-start gap-3">
                  <AppIcon
                    icon="unlocked"
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      No payment today
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      Your trial opens first. You can decide about full course access
                      later from inside the app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,0.54fr)]">
            <div className="px-5 py-6 sm:px-7">
              <h2 className="app-heading-section">Your account details</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                Use the student name and an email address you or a parent can check.
              </p>
              <SignUpForm
                initialError={error}
                source={signupSource}
                entryPath={signupEntryPath}
                destinationPath={destinationPath}
              />
            </div>

            <div className="border-t border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_64%,var(--background-elevated))] px-5 py-6 sm:px-7 lg:border-l lg:border-t-0">
              <h2 className="app-heading-section">What you can do next</h2>
              <div className="mt-4 grid gap-3">
                {unlocks.map((unlock) => (
                  <div key={unlock} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--success-surface)] text-[var(--success-text)]">
                      <AppIcon icon="completed" size={15} />
                    </span>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      {unlock}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
                <div className="flex items-start gap-3">
                  <AppIcon
                    icon="users"
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Students under 18
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      Please set this up with a parent or guardian if you need help with
                      email access, passwords, or future course choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
