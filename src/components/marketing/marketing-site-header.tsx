"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";

type MarketingSiteHeaderProps = {
  user: {
    email?: string | null;
  } | null;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/88 shadow-[0_1px_2px_rgba(16,32,51,0.03)] backdrop-blur">
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
                icon={isMobileMenuOpen ? "cancel" : "menu"}
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

            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={[
                    "rounded-xl px-3 py-2 text-sm transition",
                    activeMap[item.href]
                      ? "bg-[var(--brand-blue-soft)] font-medium text-[var(--accent-on-soft)]"
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
              <Button href="/dashboard" variant="primary" className="w-full" icon="dashboard">
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
