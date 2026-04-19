"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/shared/icons";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/access/routes";

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

function isNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeMap = useMemo(() => {
    return Object.fromEntries(
      navItems.map((item) => [item.href, isNavActive(pathname, item.href)])
    );
  }, [pathname]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/88 shadow-[0_2px_8px_rgba(16,32,51,0.04)] backdrop-blur">
      <div className="app-page px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="app-brand-lockup shrink-0" onClick={closeMobileMenu}>
            <span className="app-brand-mark ring-1 ring-[var(--border)]">
              <AppIcon icon="school" size={18} className="app-brand-text" />
            </span>

            <span className="text-lg font-semibold tracking-tight app-brand-text">
              GCSE Russian
            </span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "app-nav-link",
                    activeMap[item.href] ? "app-nav-link-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mx-1 h-5 w-px bg-[var(--border)]" />

            <ThemeToggle />

            {user ? (
              <>
                <span className="max-w-[220px] truncate text-sm text-[color:var(--text-muted)]/85">
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

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              className="app-icon-button app-focus-ring"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              <AppIcon
                icon={isMobileMenuOpen ? appIcons.cancel : appIcons.menu}
                size={18}
                className="app-icon-button-icon"
              />
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-lg)] md:hidden">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide app-text-soft">
              Navigation
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={[
                    "rounded-xl px-3 py-2 text-sm transition",
                    activeMap[item.href]
                      ? "bg-[var(--brand-blue-soft)] font-medium text-[var(--brand-blue)]"
                      : "hover:bg-[var(--background-muted)]",
                  ].join(" ")}
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
                  onClick={closeMobileMenu}
                  className="app-btn-base app-btn-secondary px-3 py-2 text-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="app-btn-base app-btn-primary px-3 py-2 text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
