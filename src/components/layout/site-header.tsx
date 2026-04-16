import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/icons";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/routes";

type SiteHeaderProps = {
  user: {
    email?: string | null;
  } | null;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: getDashboardPath(), label: "Dashboard" },
  { href: getCoursesPath(), label: "Courses" },
  { href: getAccountPath(), label: "Account" },
];

export default function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="app-page px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight app-brand-text"
          >
            <span className="max-w-[140px] leading-tight sm:max-w-none">
              GCSE Russian
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-4 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="app-nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mx-1 h-5 w-px bg-[var(--border)]" />

            <ThemeToggle />

            {user ? (
              <>
                <span className="max-w-[220px] truncate text-sm app-text-soft">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="app-nav-link">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="app-btn-base app-btn-primary px-3 py-1.5 text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <details className="group relative">
              <summary className="app-btn-base app-btn-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl list-none">
                <AppIcon icon={appIcons.menu} size={18} />
              </summary>

              <div className="absolute right-0 mt-2 w-[min(88vw,320px)] rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-lg)]">
                <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide app-text-soft">
                  Navigation
                </div>

                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--background-muted)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="my-3 border-t border-[var(--border)]" />

                {user ? (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm app-text-muted">
                      {user.email}
                    </div>

                    <LogoutButton />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="app-btn-base app-btn-secondary px-3 py-2 text-sm"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="app-btn-base app-btn-primary px-3 py-2 text-sm"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
