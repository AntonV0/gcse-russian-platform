import Link from "next/link";
import type { Metadata } from "next";
import { requestPasswordReset } from "@/app/actions/auth/auth";
import AuthShell from "@/components/auth/auth-shell";
import AuthSubmitButton from "@/components/auth/auth-submit-button";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import FeedbackBanner from "@/components/ui/feedback-banner";
import { getSafeAuthRedirectPath } from "@/lib/auth/redirect-paths";
import { buildPublicMetadata, noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...buildPublicMetadata({
    title: "Reset Password",
    description:
      "Request a password reset email for a GCSE Russian course platform account.",
    path: "/forgot-password",
  }),
  robots: noIndexRobots,
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
    from?: string;
    next?: string;
    returnTo?: string;
  }>;
}) {
  const { error, success, from, next, returnTo } = await searchParams;
  const authSource = from === "app" ? "app" : "";
  const safeNext = getSafeAuthRedirectPath(next) ?? "";
  const safeReturnTo = getSafeAuthRedirectPath(returnTo) ?? "";
  const loginParams = new URLSearchParams();

  if (authSource) {
    loginParams.set("from", "app");
  }

  if (safeNext) {
    loginParams.set("next", safeNext);
  }

  if (safeReturnTo) {
    loginParams.set("returnTo", safeReturnTo);
  }

  const loginSuffix = loginParams.size ? `?${loginParams.toString()}` : "";

  return (
    <AuthShell
      source={authSource}
      nextPath={safeNext || undefined}
      backPath={safeReturnTo || safeNext || undefined}
    >
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]">
        <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(340px,0.72fr)]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6 lg:border-b-0 lg:border-r">
            <Badge tone="info" icon="unlocked">
              Account help
            </Badge>
            <h1 className="mt-4 text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[2.75rem]">
              Reset your password
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
              Enter the email address connected to the student account. If the account
              exists, a secure reset link will be sent.
            </p>

            <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
              <div className="flex items-start gap-3">
                <AppIcon
                  icon="lock"
                  size={18}
                  className="mt-0.5 shrink-0 text-[var(--accent-ink)]"
                />
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  After using the email link, the student can choose a new password from
                  account settings.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <h2 className="app-heading-section">Send a reset email</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Use the email address connected to the student account.
            </p>

            {error ? (
              <FeedbackBanner
                tone="danger"
                title="Reset email not sent"
                description={error}
                className="mt-5"
              />
            ) : null}

            {success ? (
              <FeedbackBanner
                tone="success"
                title="Check your email"
                description="If that email belongs to an account, a reset link has been sent."
                className="mt-5"
              />
            ) : null}

            <form action={requestPasswordReset} className="mt-6 space-y-4">
              {safeNext ? <input type="hidden" name="next" value={safeNext} /> : null}
              {safeReturnTo ? (
                <input type="hidden" name="returnTo" value={safeReturnTo} />
              ) : null}
              {authSource ? <input type="hidden" name="from" value="app" /> : null}

              <div className="app-form-field">
                <label htmlFor="email" className="app-form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="app-form-control app-form-input"
                />
              </div>

              <AuthSubmitButton
                idleLabel="Send reset email"
                pendingLabel="Sending reset email..."
                idleIcon="chat"
              />
            </form>

            <Link
              href={`/login${loginSuffix}`}
              className="app-accent-link mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-bold"
            >
              Back to login
              <AppIcon icon="arrowRight" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </AuthShell>
  );
}
