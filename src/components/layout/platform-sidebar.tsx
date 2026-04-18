import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import LogoutButton from "@/components/layout/logout-button";
import { appIcons } from "@/lib/shared/icons";
import {
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
    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition app-focus-ring",
    active
      ? "bg-[var(--brand-blue-soft)] text-[var(--brand-blue)] shadow-sm"
      : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
  ].join(" ");
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

  if (role === "student" && accessMode === "volna") {
    conditionalItems.push({
      label: "Assignments",
      href: getAssignmentsPath(),
      icon: "assignments",
    });
  }

  if (role === "student" && accessMode !== "volna") {
    conditionalItems.push({
      label: "Online Classes",
      href: getOnlineClassesPath(),
      icon: "school",
    });
  }

  const utilityItems: NavItem[] = [
    { label: "Profile", href: getProfilePath(), icon: "user" },
    { label: "Settings", href: getSettingsPath(), icon: "settings" },
  ];

  return (
    <aside className="flex h-full min-h-[calc(100vh-10rem)] flex-col rounded-3xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-md)]">
      <div className="mb-4 flex items-center gap-3 px-2">
        <span className="app-brand-mark ring-1 ring-[var(--border)]">
          <AppIcon icon={appIcons.school} size={18} className="app-brand-text" />
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
              : "Platform area"}
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col">
        <div className="space-y-1">
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
            <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
              More
            </div>

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
          <div className="mb-3 border-t border-[var(--border)]" />

          <div className="space-y-1">
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
