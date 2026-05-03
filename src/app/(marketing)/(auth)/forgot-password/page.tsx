import Link from "next/link";
import type { Metadata } from "next";
import { requestPasswordReset } from "@/app/actions/auth/auth";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import FeedbackBanner from "@/components/ui/feedback-banner";
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
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className="py-8 md:py-12">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]">
        <div className="grid lg:grid-cols-[0.9fr_1fr]">
          <div className="marketing-dark-panel p-6 sm:p-8 lg:p-10">
            <Badge tone="info" icon="unlocked">
              Account help
            </Badge>
            <p className="mt-6 text-xs font-bold uppercase text-[var(--accent-ink)]">
              Password reset
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-none md:text-5xl">
              Get back into the course without starting again.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 opacity-80">
              Enter the email address connected to the student account. If the account
              exists, Supabase will send a secure reset link.
            </p>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-xs font-bold uppercase text-[var(--accent-ink)]">
                Reset access
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--text-primary)]">
                Send a reset email
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                After using the email link, the student can choose a new password from
                account settings.
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

                <button
                  type="submit"
                  className="app-btn-base app-btn-primary min-h-11 w-full px-4 py-3 text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    <AppIcon icon="chat" size={16} />
                    Send reset email
                  </span>
                </button>
              </form>

              <Link
                href="/login"
                className="app-accent-link mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-bold"
              >
                Back to login
                <AppIcon icon="arrowRight" size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
