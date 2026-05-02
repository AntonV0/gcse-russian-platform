"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "@/components/ui/app-logo";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
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
  locked?: boolean;
  lockedHref?: string;
  lockedLabel?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

function itemClass(active: boolean, locked = false) {
  return [
    "group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium transition app-focus-ring",
    active
      ? "app-selected-surface before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:[background:var(--accent-gradient-fill)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
    locked ? "opacity-85" : "",
  ].join(" ");
}

function mobileItemClass(active: boolean, locked = false) {
  return [
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition app-focus-ring",
    active
      ? "app-selected-surface"
      : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
    locked ? "opacity-85" : "",
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

  return "Explore the platform";
}

function getNavHref(item: NavItem) {
  return item.locked ? (item.lockedHref ?? "/login") : item.href;
}

function NavLockMeta({ item }: { item: NavItem }) {
  if (!item.locked) return null;

  return (
    <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--background-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
      <AppIcon icon="lock" size={11} />
      <span>{item.lockedLabel ?? "Login"}</span>
    </span>
  );
}

export default function PlatformSidebar({
  role,
  accessMode,
  pathname,
}: PlatformSidebarProps) {
  const currentPathname = usePathname();
  const activePathname = pathname ?? currentPathname;
  const isGuest = role === "guest";
  const mainItems: NavItem[] = [
    {
      label: "Dashboard",
      href: getDashboardPath(),
      icon: "dashboard",
    },
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

  conditionalItems.push({
    label: "Assignments",
    href: getAssignmentsPath(),
    icon: "assignments",
    locked: !(isVolnaStudent || isTeacher || isAdmin),
    lockedHref: isGuest ? "/login" : "/online-classes",
    lockedLabel: isGuest ? "Login" : "Volna",
  });

  conditionalItems.push({
    label: "Online Classes",
    href: getOnlineClassesPath(),
    icon: "school",
    locked: isGuest,
    lockedHref: "/login",
    lockedLabel: "Login",
  });

  if (!isNonVolnaStudent && !isTeacher && !isAdmin && !isGuest) {
    const onlineClasses = conditionalItems.find(
      (item) => item.href === getOnlineClassesPath()
    );

    if (onlineClasses) {
      onlineClasses.locked = true;
      onlineClasses.lockedHref = getDashboardPath();
      onlineClasses.lockedLabel = "N/A";
    }
  }

  const utilityItems: NavItem[] = [
    {
      label: "Overview",
      href: getAccountPath(),
      icon: "dashboard",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Billing",
      href: getBillingPath(),
      icon: "billing",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Profile",
      href: getProfilePath(),
      icon: "student",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
    {
      label: "Settings",
      href: getSettingsPath(),
      icon: "settings",
      locked: isGuest,
      lockedHref: "/login",
      lockedLabel: "Login",
    },
  ];

  return (
    <>
      <section className="dev-marker-host relative lg:hidden">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)]">
          <div className="mb-4">
            <AppLogo
              variant={isAdmin ? "domain" : "full"}
              size="sm"
              subtitle={getAccessLabel(role, accessMode)}
              showIcon={!isAdmin}
            />
          </div>

          <nav className="space-y-3" aria-label="Platform navigation">
            <div>
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
                Learn
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin]">
                {[...mainItems, ...conditionalItems].map((item) => {
                  const active = isActive(activePathname, item.href);
                  const href = getNavHref(item);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={mobileItemClass(active, item.locked)}
                      aria-current={active ? "page" : undefined}
                      aria-label={
                        item.locked
                          ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                          : undefined
                      }
                    >
                      <AppIcon icon={item.icon} size={16} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.locked ? <AppIcon icon="lock" size={12} /> : null}
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
                  const href = getNavHref(item);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={mobileItemClass(active, item.locked)}
                      aria-current={active ? "page" : undefined}
                      aria-label={
                        item.locked
                          ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                          : undefined
                      }
                    >
                      <AppIcon icon={item.icon} size={16} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.locked ? <AppIcon icon="lock" size={12} /> : null}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3 px-1">
                {isGuest ? (
                  <div className="flex flex-wrap gap-2">
                    <Button href="/login" variant="secondary" size="sm" icon="user">
                      Log in
                    </Button>
                    <Button href="/signup" variant="primary" size="sm" icon="create">
                      Sign up
                    </Button>
                  </div>
                ) : (
                  <LogoutButton />
                )}
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
          <AppLogo
            variant={isAdmin ? "domain" : "full"}
            size="sm"
            subtitle={getAccessLabel(role, accessMode)}
            showIcon={!isAdmin}
          />
        </div>

        <nav className="flex flex-1 flex-col" aria-label="Platform navigation">
          <div className="space-y-1">
            {sectionLabel("Learn")}

            {mainItems.map((item) => {
              const active = isActive(activePathname, item.href);
              const href = getNavHref(item);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={itemClass(active, item.locked)}
                  aria-current={active ? "page" : undefined}
                  aria-label={
                    item.locked
                      ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                      : undefined
                  }
                >
                  <AppIcon
                    icon={item.icon}
                    size={18}
                    className={[
                      "shrink-0",
                      active
                        ? "text-[var(--accent-on-soft)]"
                        : "text-[var(--text-muted)]",
                    ].join(" ")}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <NavLockMeta item={item} />
                </Link>
              );
            })}
          </div>

          {conditionalItems.length > 0 ? (
            <div className="mt-5 space-y-1">
              {sectionLabel("More")}

              {conditionalItems.map((item) => {
                const active = isActive(activePathname, item.href);
                const href = getNavHref(item);

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={itemClass(active, item.locked)}
                    aria-current={active ? "page" : undefined}
                    aria-label={
                      item.locked
                        ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "access"}`
                        : undefined
                    }
                  >
                    <AppIcon
                      icon={item.icon}
                      size={18}
                      className={[
                        "shrink-0",
                        active
                          ? "text-[var(--accent-on-soft)]"
                          : "text-[var(--text-muted)]",
                      ].join(" ")}
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <NavLockMeta item={item} />
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
                const href = getNavHref(item);

                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={itemClass(active, item.locked)}
                    aria-current={active ? "page" : undefined}
                    aria-label={
                      item.locked
                        ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                        : undefined
                    }
                  >
                    <AppIcon
                      icon={item.icon}
                      size={18}
                      className={[
                        "shrink-0",
                        active
                          ? "text-[var(--accent-on-soft)]"
                          : "text-[var(--text-muted)]",
                      ].join(" ")}
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <NavLockMeta item={item} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4">
              {isGuest ? (
                <div className="grid gap-2">
                  <Button href="/login" variant="secondary" size="sm" icon="user">
                    Log in
                  </Button>
                  <Button href="/signup" variant="primary" size="sm" icon="create">
                    Sign up
                  </Button>
                </div>
              ) : (
                <LogoutButton />
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
