"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
const FOOTER_STICKY_HANDOFF_MARGIN = 160;

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

function itemClass(active: boolean, locked = false) {
  return [
    "group relative flex items-center gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition app-focus-ring",
    active
      ? [
          "border-[color-mix(in_srgb,var(--accent)_24%,var(--border-subtle))]",
          "bg-[color-mix(in_srgb,var(--accent)_9%,var(--background-elevated))]",
          "text-[var(--text-primary)]",
          "shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_4%,transparent),0_10px_22px_color-mix(in_srgb,var(--accent)_10%,transparent)]",
          "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:[background:var(--accent-gradient-fill)]",
        ].join(" ")
      : "text-[color-mix(in_srgb,var(--text-secondary)_88%,var(--text-primary))] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
    locked ? "opacity-85" : "",
  ].join(" ");
}

function mobileItemClass(active: boolean, locked = false) {
  return [
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition app-focus-ring",
    active
      ? [
          "border-[color-mix(in_srgb,var(--accent)_24%,var(--border-subtle))]",
          "bg-[color-mix(in_srgb,var(--accent)_9%,var(--background-elevated))]",
          "text-[var(--text-primary)]",
          "shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_4%,transparent),0_10px_22px_color-mix(in_srgb,var(--accent)_10%,transparent)]",
        ].join(" ")
      : "border-[var(--border)] bg-[var(--background-elevated)] text-[color-mix(in_srgb,var(--text-secondary)_88%,var(--text-primary))] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
    locked ? "opacity-85" : "",
  ].join(" ");
}

function navIconClass(active: boolean) {
  return [
    "shrink-0 transition-colors",
    active
      ? "text-[var(--accent-on-soft)]"
      : "text-[color-mix(in_srgb,var(--text-muted)_68%,var(--text-secondary))] group-hover:text-[var(--text-primary)]",
  ].join(" ");
}

function sectionLabel(label: string) {
  return (
    <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] app-text-soft">
      {label}
    </div>
  );
}

function SidebarHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 px-2 pt-1">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {eyebrow}
      </div>
      <h2 className="mt-1 text-xl font-semibold leading-tight text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fill)] shadow-[0_0_0_4px_var(--accent-ring)]" />
        <span className="min-w-0 truncate">{subtitle}</span>
      </div>
      <div className="mt-4 h-px bg-[linear-gradient(90deg,var(--surface-accent-border)_0%,var(--border-subtle)_54%,transparent_100%)]" />
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

function titleCaseSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSidebarContextLabel(
  pathname: string | undefined,
  role: PlatformSidebarProps["role"],
  accessMode: PlatformSidebarProps["accessMode"]
) {
  if (!pathname?.startsWith("/courses")) {
    return getAccessLabel(role, accessMode);
  }

  const [, , variantSlug] = pathname.split("/").filter(Boolean);

  if (variantSlug) {
    return `${titleCaseSlug(variantSlug)} course`;
  }

  return role === "admin" ? "Course view" : "GCSE Russian course";
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
  const desktopSidebarRef = useRef<HTMLElement>(null);
  const currentPathname = usePathname();
  const activePathname = pathname ?? currentPathname;
  const isGuest = role === "guest";
  const isCourseView = activePathname?.startsWith("/courses");
  const mainItems: NavItem[] = [
    {
      label: "Dashboard",
      href: getDashboardPath(),
      icon: "dashboard",
    },
    { label: "Courses", href: getCoursesPath(), icon: "courses" },
    { label: "Vocabulary", href: getVocabularyPath(), icon: "vocabulary" },
    { label: "Grammar", href: getGrammarPath(), icon: "grammar" },
  ];

  const practiceItems: NavItem[] = [
    { label: "Past Papers", href: getPastPapersPath(), icon: "pastPapers" },
    { label: "Mock Exams", href: getMockExamsPath(), icon: "mockExam" },
  ];

  const isStudent = role === "student";
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";
  const accessLabel = getSidebarContextLabel(activePathname, role, accessMode);
  const sidebarEyebrow = isCourseView ? "GCSE Russian" : "Platform";
  const sidebarTitle = isCourseView ? "Study Menu" : "Main Menu";
  const isVolnaStudent = isStudent && accessMode === "volna";
  const isNonVolnaStudent = isStudent && accessMode !== "volna";

  practiceItems.push({
    label: "Assignments",
    href: getAssignmentsPath(),
    icon: "assignments",
    locked: !(isVolnaStudent || isTeacher || isAdmin),
    lockedHref: isGuest ? "/login" : "/online-classes",
    lockedLabel: isGuest ? "Login" : "Volna",
  });

  practiceItems.push({
    label: "Online Classes",
    href: getOnlineClassesPath(),
    icon: "school",
    locked: isGuest,
    lockedHref: "/login",
    lockedLabel: "Login",
  });

  if (!isNonVolnaStudent && !isTeacher && !isAdmin && !isGuest) {
    const onlineClasses = practiceItems.find(
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

  useEffect(() => {
    const sidebar = desktopSidebarRef.current;
    if (!sidebar) return;
    const sidebarElement = sidebar;
    const wrapperElement = sidebarElement.parentElement;

    let frameId = 0;
    let topOffset = 0;
    let fullHeight = 0;
    let lastHeight = -1;
    let isFooterVisible = false;

    function setSidebarHeight(nextHeight: number) {
      if (Math.abs(nextHeight - lastHeight) < 0.25) return;

      lastHeight = nextHeight;
      sidebarElement.style.setProperty("--platform-sidebar-height", `${nextHeight.toFixed(2)}px`);
    }

    function setFooterMode(enabled: boolean) {
      if (!wrapperElement) return;

      if (!enabled) {
        wrapperElement.style.removeProperty("height");
        sidebarElement.style.removeProperty("position");
        sidebarElement.style.removeProperty("top");
        sidebarElement.style.removeProperty("left");
        sidebarElement.style.removeProperty("width");
        sidebarElement.style.removeProperty("z-index");
        return;
      }

      const wrapperRect = wrapperElement.getBoundingClientRect();

      wrapperElement.style.height = `${fullHeight.toFixed(2)}px`;
      sidebarElement.style.position = "fixed";
      sidebarElement.style.top = `${topOffset.toFixed(2)}px`;
      sidebarElement.style.left = `${wrapperRect.left.toFixed(2)}px`;
      sidebarElement.style.width = `${wrapperRect.width.toFixed(2)}px`;
      sidebarElement.style.zIndex = "20";
    }

    function measureViewport() {
      const stickyTop = wrapperElement
        ? Number.parseFloat(window.getComputedStyle(wrapperElement).top)
        : 0;
      const bottomPadding = 16;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

      topOffset = Number.isFinite(stickyTop) ? stickyTop : 0;
      fullHeight = Math.max(0, viewportHeight - topOffset - bottomPadding);
    }

    function updateSidebarHeight() {
      if (!isFooterVisible) {
        setFooterMode(false);
        setSidebarHeight(fullHeight);
        return;
      }

      setFooterMode(true);
      window.cancelAnimationFrame(frameId);

      frameId = window.requestAnimationFrame(() => {
        const bottomPadding = 16;
        const footer = document.querySelector<HTMLElement>("[data-site-footer]");
        const footerTop =
          footer?.getBoundingClientRect().top ?? topOffset + fullHeight + bottomPadding;
        const availableHeight = Math.max(0, footerTop - topOffset - bottomPadding);
        const nextHeight = Math.min(fullHeight, availableHeight);

        setSidebarHeight(nextHeight);
      });
    }

    measureViewport();
    setSidebarHeight(fullHeight);

    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    const footerObserver =
      footer && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isFooterVisible = Boolean(entry?.isIntersecting);
              updateSidebarHeight();
            },
            { rootMargin: `0px 0px ${FOOTER_STICKY_HANDOFF_MARGIN}px 0px` }
          )
        : null;

    if (footerObserver && footer) {
      footerObserver.observe(footer);
    } else {
      isFooterVisible = true;
    }

    function handleScroll() {
      if (isFooterVisible) {
        updateSidebarHeight();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    function updateSidebarMeasurements() {
      measureViewport();
      updateSidebarHeight();
    }

    window.addEventListener("resize", updateSidebarMeasurements);
    window.visualViewport?.addEventListener("resize", updateSidebarMeasurements);

    return () => {
      window.cancelAnimationFrame(frameId);
      setFooterMode(false);
      footerObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateSidebarMeasurements);
      window.visualViewport?.removeEventListener("resize", updateSidebarMeasurements);
    };
  }, []);

  return (
    <>
      <section className="dev-marker-host relative lg:hidden">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)]">
          <SidebarHeader
            eyebrow={sidebarEyebrow}
            title={sidebarTitle}
            subtitle={accessLabel}
          />

          <nav className="space-y-3" aria-label="Platform navigation">
            <div>
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
                Learn
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin]">
                {mainItems.map((item) => {
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
                Practice
              </div>
              <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin]">
                {practiceItems.map((item) => {
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
                          ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "access"}`
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
                  <LogoutButton variant="quiet" />
                )}
              </div>
            </div>
          </nav>
        </div>
      </section>

      <aside
        ref={desktopSidebarRef}
        className="dev-marker-host relative hidden h-[var(--platform-sidebar-height,calc(100dvh-var(--sticky-site-offset)-1rem))] min-h-0 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)] lg:flex"
      >
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

        <SidebarHeader
          eyebrow={sidebarEyebrow}
          title={sidebarTitle}
          subtitle={accessLabel}
        />

        <nav
          className="-mr-1 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pr-1"
          aria-label="Platform navigation"
        >
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
                  <AppIcon icon={item.icon} size={18} className={navIconClass(active)} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <NavLockMeta item={item} />
                </Link>
              );
            })}
          </div>

          {practiceItems.length > 0 ? (
            <div className="mt-5 space-y-1">
              {sectionLabel("Practice")}

              {practiceItems.map((item) => {
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
                    <AppIcon icon={item.icon} size={18} className={navIconClass(active)} />
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
                    <AppIcon icon={item.icon} size={18} className={navIconClass(active)} />
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
                <LogoutButton variant="quiet" />
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
