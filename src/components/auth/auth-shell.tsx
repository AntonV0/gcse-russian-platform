import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";

function AuthShellHeader({
  source,
  activePage,
  nextPath,
  backPath,
}: {
  source?: string;
  activePage?: "login" | "signup";
  nextPath?: string;
  backPath?: string;
}) {
  const isAppSource = source === "app";
  const loginParams = new URLSearchParams();
  const signupParams = new URLSearchParams();

  if (isAppSource) {
    loginParams.set("from", "app");
    signupParams.set("from", "app");
  }

  if (nextPath && nextPath !== "/dashboard") {
    loginParams.set("next", nextPath);
  }

  if (backPath && backPath !== nextPath) {
    loginParams.set("returnTo", backPath);
  }

  const signupDestination = backPath ?? nextPath;

  if (signupDestination && signupDestination !== "/dashboard") {
    signupParams.set("next", signupDestination);
  }

  const loginSuffix = loginParams.size ? `?${loginParams.toString()}` : "";
  const signupSuffix = signupParams.size ? `?${signupParams.toString()}` : "";
  const backLink = isAppSource
    ? {
        href: backPath ?? nextPath ?? "/",
        label: "Back to app preview",
      }
    : { href: "/marketing", label: "Back to GCSE Russian" };

  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--background-elevated)]/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="app-focus-ring flex min-w-0 items-center gap-3 rounded-lg"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_24%,var(--border-subtle))] bg-[var(--background-elevated)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_16%,transparent)]">
            <Image
              src="/brand/logo-final/favicon-r-light-64.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-full w-full"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-extrabold leading-5 text-[var(--text-primary)]">
              GCSE Russian
            </span>
            <span className="block text-xs font-medium leading-4 app-text-muted">
              Student account
            </span>
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-2 max-sm:w-full"
          aria-label="Account"
        >
          <Button href={backLink.href} variant="quiet" size="sm" icon="back">
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">{backLink.label}</span>
          </Button>
          {activePage !== "login" ? (
            <Button
              href={`/login${loginSuffix}`}
              variant="secondary"
              size="sm"
              icon="user"
            >
              Log in
            </Button>
          ) : null}
          {activePage !== "signup" ? (
            <Button
              href={`/signup${signupSuffix}`}
              variant="primary"
              size="sm"
              icon="create"
            >
              Sign up
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function AuthShellFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-5 text-xs leading-5 text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>Need help with your account? Contact GCSE Russian support.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Auth support">
          <Link
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="app-accent-link rounded-sm font-semibold"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="app-accent-link rounded-sm font-semibold"
          >
            Terms
          </Link>
          <Link
            href="/support"
            target="_blank"
            rel="noreferrer"
            className="app-accent-link rounded-sm font-semibold"
          >
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default function AuthShell({
  children,
  source,
  activePage,
  nextPath,
  backPath,
}: {
  children: React.ReactNode;
  source?: string;
  activePage?: "login" | "signup";
  nextPath?: string;
  backPath?: string;
}) {
  return (
    <div data-accent="blue" className="min-h-screen bg-[var(--background)]">
      <AuthShellHeader
        source={source}
        activePage={activePage}
        nextPath={nextPath}
        backPath={backPath}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {children}
      </main>

      <AuthShellFooter />
    </div>
  );
}
