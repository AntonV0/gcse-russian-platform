import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import ConfirmEmailResendForm from "@/components/auth/confirm-email-resend-form";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";
import { getSignupOnboardingPath } from "@/lib/auth/signup-redirects";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Confirm Your Email | GCSE Russian",
  robots: noIndexRobots,
};

export default async function ConfirmSignupEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; next?: string }>;
}) {
  const { from, next } = await searchParams;
  const destinationPath = getPostOnboardingRedirectPath(next);
  const onboardingPath = getSignupOnboardingPath(destinationPath);
  const source = from === "app" ? "app" : "marketing";
  const loginParams = new URLSearchParams({
    next: onboardingPath,
  });

  if (source === "app") {
    loginParams.set("from", "app");
  }

  return (
    <AuthShell
      source={source}
      activePage="signup"
      nextPath={onboardingPath}
      backPath={destinationPath}
    >
      <div className="mx-auto max-w-2xl">
        <section className="rounded-[var(--radius-xl)] border border-[var(--surface-panel-border)] bg-[var(--background-elevated)] p-5 shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_5%,transparent)] sm:p-7">
          <div className="flex flex-wrap gap-2">
            <Badge tone="success" icon="completed">
              Account details saved
            </Badge>
            <Badge tone="info" icon="info">
              Email confirmation
            </Badge>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-muted-bg)] text-[var(--accent-ink)]">
              <AppIcon icon="user" size={22} />
            </span>
            <div>
              <h1 className="text-[2.15rem] font-extrabold leading-[1.05] text-[var(--text-primary)] [letter-spacing:0] md:text-[2.7rem]">
                Confirm your email to continue
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                We sent a confirmation link to the account email address. Open it in the
                same browser to finish signing in, choose Foundation or Higher, and
                continue to your original resource.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              What happens next
            </h2>
            <ol className="mt-3 grid gap-2 text-sm leading-6 text-[var(--text-secondary)]">
              <li>1. Open the confirmation email.</li>
              <li>2. Return here automatically and choose your trial path.</li>
              <li>3. Continue to the resource that prompted signup.</li>
            </ol>
          </div>

          <div className="mt-6">
            <h2 className="app-heading-subsection">Email not there yet?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Check spam first, then enter the same account email to send a new
              confirmation link.
            </p>
            <ConfirmEmailResendForm destinationPath={destinationPath} />
          </div>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <Button
              href={`/login?${loginParams.toString()}`}
              variant="secondary"
              icon="user"
            >
              Already confirmed? Log in
            </Button>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
