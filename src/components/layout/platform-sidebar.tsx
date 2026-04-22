import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import LogoutButton from "@/components/layout/logout-button";
import { appIcons } from "@/lib/shared/icons";
import {
  getAccountPath,
  getAssignmentsPath,
  getCoursesPath,
  getDashboardPath,
  getGrammarPath,
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
  icon: keyof typeof appIcons;
  external?: boolean;
};

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

function itemClass(active: boolean) {
  return [
    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition app-focus-ring",
    active
      ? "bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] shadow-sm ring-1 ring-[var(--brand-blue)]/10"
      : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function sectionLabel(label: string) {
  return (
    <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
      {label}
    </div>
  );
}

export default function PlatformSidebar({
  role,
  accessMode,
  pathname,
}: PlatformSidebarProps) {
  const mainItems: NavItem[] = [
    { label: "Dashboard", href: getDashboardPath(), icon: "dashboard" },
    { label: "Courses", href: getCoursesPath(), icon: "courses" },
    { label: "Vocabulary", href: getVocabularyPath(), icon: "language" },
    { label: "Grammar", href: getGrammarPath(), icon: "lessonContent" },
    { label: "Past Papers", href: getPastPapersPath(), icon: "file" },
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
    { label: "Profile", href: getProfilePath(), icon: "user" },
    { label: "Settings", href: getSettingsPath(), icon: "settings" },
  ];

  return (
    <aside className="flex h-full min-h-[calc(100vh-10rem)] flex-col rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)]">
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
              {role === "student"
                ? accessMode === "volna"
                  ? "Volna student"
                  : accessMode === "full"
                    ? "Full access"
                    : accessMode === "trial"
                      ? "Trial access"
                      : "Student area"
                : role === "admin"
                  ? "Admin area"
                  : role === "teacher"
                    ? "Teacher area"
                    : "Platform area"}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col">
        <div className="space-y-1">
          {sectionLabel("Learn")}

          {mainItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link key={item.href} href={item.href} className={itemClass(active)}>
                <AppIcon
                  icon={appIcons[item.icon]}
                  size={18}
                  className={
                    active ? "text-[var(--brand-blue)]" : "text-[var(--text-muted)]"
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
              const active = isActive(pathname, item.href);

              return (
                <Link key={item.href} href={item.href} className={itemClass(active)}>
                  <AppIcon
                    icon={appIcons[item.icon]}
                    size={18}
                    className={
                      active ? "text-[var(--brand-blue)]" : "text-[var(--text-muted)]"
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
              const active = isActive(pathname, item.href);

              return (
                <Link key={item.href} href={item.href} className={itemClass(active)}>
                  <AppIcon
                    icon={appIcons[item.icon]}
                    size={18}
                    className={
                      active ? "text-[var(--brand-blue)]" : "text-[var(--text-muted)]"
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
  );
}
