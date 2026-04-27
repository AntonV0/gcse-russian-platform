"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AppLogo from "@/components/ui/app-logo";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import ThemeToggle from "@/components/ui/theme-toggle";

type MarketingSiteHeaderProps = {
  user: {
    email?: string | null;
  } | null;
};

const navItems = [
  { href: "/marketing", label: "Home" },
  { href: "/gcse-russian-course", label: "Course" },
  { href: "/resources", label: "Resources" },
  { href: "/gcse-russian-exam-guide", label: "Exam guide" },
  { href: "/russian-gcse-private-candidate", label: "Private candidates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/marketing") {
    return pathname === "/marketing";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MarketingSiteHeader({ user }: MarketingSiteHeaderProps) {
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
    <header className="app-site-header">
      <div className="app-page px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/marketing" className="min-w-0 shrink-0" onClick={closeMobileMenu}>
            <span className="sm:hidden">
              <AppLogo variant="domain" size="sm" />
            </span>
            <span className="hidden sm:inline-flex">
              <AppLogo variant="domain" size="md" />
            </span>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            <nav
              className="flex items-center gap-4 text-sm"
              aria-label="Marketing navigation"
            >
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
              <Button href="/dashboard" variant="primary" size="sm" icon="dashboard">
                Open app
              </Button>
            ) : (
              <>
                <Link href="/login" className="app-nav-link">
                  Log in
                </Link>
                <Button href="/signup" variant="primary" size="sm" icon="create">
                  Start trial
                </Button>
              </>
            )}
          </div>

          <div className="flex min-w-[5.5rem] shrink-0 items-center justify-end gap-2 lg:hidden">
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
              <Button
                href="/dashboard"
                variant="primary"
                className="w-full"
                icon="dashboard"
              >
                Open app
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button href="/login" variant="secondary" className="w-full" icon="user">
                  Log in
                </Button>
                <Button href="/signup" variant="primary" className="w-full" icon="create">
                  Start trial
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
