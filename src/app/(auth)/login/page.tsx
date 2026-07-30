import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import LoginForm from "@/components/auth/login-form";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getSafeAuthRedirectPath } from "@/lib/auth/redirect-paths";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "Log In To Continue Studying",
    description:
      "Log in to the GCSE Russian course platform to continue lessons, vocabulary, grammar, exam practice, and revision.",
    path: "/login",
  }),
  robots: noIndexRobots,
};

const resumeItems = [
  "Continue your next lesson",
  "Return to saved vocabulary and grammar practice",
  "Review mock attempts and progress",
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    next?: string;
    returnTo?: string;
    from?: string;
  }>;
}) {
  const { error, next, returnTo, from } = await searchParams;
  const safeNext = getSafeAuthRedirectPath(next) ?? "";
  const safeReturnTo = getSafeAuthRedirectPath(returnTo) ?? "";
  const authSource = from === "app" ? "app" : "";
  const signupParams = new URLSearchParams();

  if (authSource) {
    signupParams.set("from", "app");
  }

  if (safeReturnTo || safeNext) {
    signupParams.set("next", safeReturnTo || safeNext);
  }

  const sourceSuffix = signupParams.size ? `?${signupParams.toString()}` : "";

  return (
    <AuthShell
      source={authSource}
      activePage="login"
      nextPath={safeNext || undefined}
      backPath={safeReturnTo || safeNext || undefined}
    >
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(340px,0.64fr)] lg:items-start">
        <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="dashboard">
                Student dashboard
              </Badge>
              <Badge tone="success" icon="completed">
                Saved progress
              </Badge>
            </div>
            <h1 className="mt-4 text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[3rem]">
              Log in to continue studying
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              Return to your GCSE Russian lessons, practice questions, mock exams, and
              saved study route.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <LoginForm
              initialError={error}
              nextPath={safeNext}
              returnPath={safeReturnTo}
              source={authSource}
            />
          </div>
        </section>

        <aside className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_76%,var(--background-elevated))] p-5 shadow-[var(--shadow-xs)]">
          <h2 className="app-heading-subsection">
            Your account keeps the route together
          </h2>
          <div className="mt-4 grid gap-3">
            {resumeItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                  <AppIcon icon="completed" size={15} />
                </span>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              New to the course?
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Create a free trial account first. Checkout only happens later from inside
              the app.
            </p>
            <div className="mt-4">
              <Button
                href={`/signup${sourceSuffix}`}
                variant="primary"
                size="sm"
                icon="create"
              >
                Create trial account
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AuthShell>
  );
}
