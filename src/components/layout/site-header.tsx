"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import IconButton from "@/components/ui/icon-button";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/access/routes";

type SiteHeaderProps = {
  user: {
    email?: string | null;
  } | null;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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
    <header className="dev-marker-host app-site-header">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="SiteHeader"
          filePath="src/components/layout/site-header.tsx"
          tier="layout"
          componentRole="Public/top-level site header"
          bestFor="Primary site navigation, auth links, mobile menu, branding, and theme toggle in the main site chrome."
          usageExamples={[
            "Homepage header",
            "Pricing page header",
            "Login/signup navigation",
            "Top-level course site navigation",
          ]}
          notes="Use at the site layout boundary. Do not use inside platform pages that already use the platform shell/sidebar."
        />
      ) : null}

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

          <div className="hidden items-center gap-4 lg:flex">
            <nav className="flex items-center gap-4 text-sm" aria-label="Main navigation">
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
                  aria-current={activeMap[item.href] ? "page" : undefined}
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
                <Button href="/signup" variant="primary" size="sm" icon="create">
                  Sign up
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <IconButton
              type="button"
              icon={isMobileMenuOpen ? "cancel" : "menu"}
              label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            />
          </div>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-lg)] lg:hidden">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide app-text-soft">
              Navigation
            </div>

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={[
                    "flex min-h-11 items-center rounded-xl px-3 py-2 text-sm transition",
                    activeMap[item.href]
                      ? "font-medium [background:var(--accent-gradient-selected)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]"
                      : "hover:bg-[var(--background-muted)]",
                  ].join(" ")}
                  aria-current={activeMap[item.href] ? "page" : undefined}
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
                <Button
                  href="/login"
                  variant="secondary"
                  className="w-full"
                  icon="user"
                >
                  Log in
                </Button>
                <Button
                  href="/signup"
                  variant="primary"
                  className="w-full"
                  icon="create"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
