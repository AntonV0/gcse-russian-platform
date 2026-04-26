"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import LogoutButton from "@/components/layout/logout-button";
import type { AppIconKey } from "@/lib/shared/icons";
import {
  getAccountPath,
  getAssignmentsPath,
  getBillingPath,
  getCoursesPath,
  getDashboardPath,
  getGrammarPath,
  getMockExamsPath,
  getOnlineClassesPath,
  getPastPapersPath,
  getProfilePath,
  getSettingsPath,
  getVocabularyPath,
} from "@/lib/access/routes";

type PlatformSidebarProps = {
  role: "admin" | "teacher" | "student" | "guest";
  accessMode: "trial" | "full" | "volna" | null;
  pathname?: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: AppIconKey;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

function itemClass(active: boolean) {
  return [
    "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium transition app-focus-ring",
    active
      ? "app-selected-surface before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:[background:var(--accent-gradient-fill)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function mobileItemClass(active: boolean) {
  return [
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition app-focus-ring",
    active
      ? "app-selected-surface"
      : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function sectionLabel(label: string) {
  return (
    <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
      {label}
    </div>
  );
}

function getAccessLabel(
  role: PlatformSidebarProps["role"],
  accessMode: PlatformSidebarProps["accessMode"]
) {
  if (role === "student") {
    if (accessMode === "volna") return "Volna student";
    if (accessMode === "full") return "Full access";
    if (accessMode === "trial") return "Trial access";
    return "Student area";
  }

  if (role === "admin") return "Admin area";
  if (role === "teacher") return "Teacher area";

  return "Platform area";
}

export default function PlatformSidebar({
  role,
  accessMode,
  pathname,
}: PlatformSidebarProps) {
  const currentPathname = usePathname();
  const activePathname = pathname ?? currentPathname;
  const mainItems: NavItem[] = [
    { label: "Dashboard", href: getDashboardPath(), icon: "dashboard" },
    { label: "Courses", href: getCoursesPath(), icon: "courses" },
    { label: "Vocabulary", href: getVocabularyPath(), icon: "vocabulary" },
    { label: "Grammar", href: getGrammarPath(), icon: "grammar" },
    { label: "Past Papers", href: getPastPapersPath(), icon: "pastPapers" },
    { label: "Mock Exams", href: getMockExamsPath(), icon: "mockExam" },
  ];

  const conditionalItems: NavItem[] = [];

  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";
  const isVolnaStudent = isStudent && accessMode === "volna";
  const isNonVolnaStudent = isStudent && accessMode !== "volna";

  if (isVolnaStudent || isTeacher || isAdmin) {
    conditionalItems.push({
      label: "Assignments",
      href: getAssignmentsPath(),
      icon: "assignments",
    });
  }

  if (isNonVolnaStudent || isTeacher || isAdmin) {
    conditionalItems.push({
      label: "Online Classes",
      href: getOnlineClassesPath(),
      icon: "school",
    });
  }

  const utilityItems: NavItem[] = [
    { label: "Overview", href: getAccountPath(), icon: "dashboard" },
    { label: "Billing", href: getBillingPath(), icon: "billing" },
    { label: "Profile", href: getProfilePath(), icon: "student" },
    { label: "Settings", href: getSettingsPath(), icon: "settings" },
  ];

  return (
    <>
    <section className="dev-marker-host relative lg:hidden">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="app-brand-mark ring-1 ring-[var(--border)]">
            <AppIcon icon="school" size={18} className="app-brand-text" />
          </span>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
              GCSE Russian
            </div>
            <div className="text-xs app-text-soft">
              {getAccessLabel(role, accessMode)}
            </div>
          </div>
        </div>

        <nav className="space-y-3" aria-label="Platform navigation">
          <div>
            <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
              Learn
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin]">
              {[...mainItems, ...conditionalItems].map((item) => {
                const active = isActive(activePathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={mobileItemClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <AppIcon icon={item.icon} size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
              Account
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin]">
              {utilityItems.map((item) => {
                const active = isActive(activePathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={mobileItemClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <AppIcon icon={item.icon} size={16} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 px-1">
              <LogoutButton />
            </div>
          </div>
        </nav>
      </div>
    </section>

    <aside className="dev-marker-host relative hidden h-full min-h-[calc(100vh-10rem)] flex-col rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)] lg:flex">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PlatformSidebar"
          filePath="src/components/layout/platform-sidebar.tsx"
          tier="layout"
          componentRole="Role-aware platform sidebar navigation"
          bestFor="Authenticated platform pages, student/teacher/admin navigation, account utilities, and access-aware route groups."
          usageExamples={[
            "Student platform shell",
            "Teacher assignment area",
            "Admin navigation shell",
            "Account/settings navigation",
          ]}
          notes="Use inside the authenticated platform layout. Keep route visibility rules here aligned with access control helpers."
        />
      ) : null}

      <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 px-3 py-3">
        <div className="flex items-center gap-3">
          <span className="app-brand-mark ring-1 ring-[var(--border)]">
            <AppIcon icon="school" size={18} className="app-brand-text" />
          </span>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
              GCSE Russian
            </div>
            <div className="text-xs app-text-soft">
              {getAccessLabel(role, accessMode)}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col" aria-label="Platform navigation">
        <div className="space-y-1">
          {sectionLabel("Learn")}

          {mainItems.map((item) => {
            const active = isActive(activePathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={itemClass(active)}
                aria-current={active ? "page" : undefined}
              >
                <AppIcon
                  icon={item.icon}
                  size={18}
                  className={
                    active ? "text-[var(--accent-on-soft)]" : "text-[var(--text-muted)]"
                  }
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {conditionalItems.length > 0 ? (
          <div className="mt-5 space-y-1">
            {sectionLabel("More")}

            {conditionalItems.map((item) => {
              const active = isActive(activePathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <AppIcon
                    icon={item.icon}
                    size={18}
                    className={
                      active ? "text-[var(--accent-on-soft)]" : "text-[var(--text-muted)]"
                    }
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="mt-auto pt-6">
          <div className="mb-4 border-t border-[var(--border)]" />

          <div className="space-y-1">
            {sectionLabel("Account")}

            {utilityItems.map((item) => {
              const active = isActive(activePathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <AppIcon
                    icon={item.icon}
                    size={18}
                    className={
                      active ? "text-[var(--accent-on-soft)]" : "text-[var(--text-muted)]"
                    }
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4">
            <LogoutButton />
          </div>
        </div>
      </nav>
    </aside>
    </>
  );
}
