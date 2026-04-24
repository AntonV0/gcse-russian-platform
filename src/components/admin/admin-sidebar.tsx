"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import { uiLabPages } from "@/lib/ui/ui-lab";

function getNavItemClass(isActive: boolean, isSubItem = false) {
  return [
    "group flex w-full items-center gap-3 text-sm leading-5 transition-all duration-150",
    isSubItem ? "px-3 py-2" : "px-3 py-2.5",
    isActive
      ? "border-l-2 border-[var(--brand-blue)] bg-[var(--background-muted)] font-medium text-[var(--text-primary)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)]/70 hover:text-[var(--text-primary)]",
  ].join(" ");
}

function getSectionLabelClass() {
  return "px-3 text-[11px] font-semibold uppercase tracking-[0.14em] app-text-soft";
}

function getUiLabItemIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("overview")) return "dashboard";
  if (normalized.includes("admin")) return "settings";
  if (normalized.includes("button")) return "pencil";
  if (normalized.includes("component")) return "component";
  if (normalized.includes("feedback")) return "feedback";
  if (normalized.includes("form")) return "forms";
  if (normalized.includes("icon")) return "star";
  if (normalized.includes("layout")) return "layout";
  if (normalized.includes("lesson builder")) return "blocks";
  if (normalized.includes("lesson content")) return "lessons";
  if (normalized.includes("navigation")) return "navigation";
  if (normalized.includes("surface")) return "surfaces";
  if (normalized.includes("table")) return "list";
  if (normalized.includes("theme")) return "moon";
  if (normalized.includes("typography")) return "text";

  return "file";
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className={getSectionLabelClass()}>{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname === "/admin";
  const isContent = pathname.startsWith("/admin/content");
  const isVocabulary = pathname.startsWith("/admin/vocabulary");
  const isUiLab = pathname.startsWith("/admin/ui");
  const isQuestionSets =
    pathname === "/admin/question-sets" || pathname.startsWith("/admin/question-sets/");
  const isQuestionTemplates = pathname === "/admin/question-sets/templates";
  const isLessonTemplates = pathname.startsWith("/admin/lesson-templates");
  const isAssignments = pathname.startsWith("/teacher/assignments");
  const isTeachingGroups = pathname.startsWith("/admin/teaching-groups");
  const isStudents = pathname.startsWith("/admin/students");
  const isTeachers = pathname.startsWith("/admin/teachers");

  const [isUiOpen, setIsUiOpen] = useState(isUiLab);
  const showUiSection = isUiOpen;

  const sortedUiLabPages = useMemo(() => {
    const overview = uiLabPages.find((item) => item.href === "/admin/ui");
    const others = uiLabPages
      .filter((item) => item.href !== "/admin/ui")
      .sort((a, b) => a.label.localeCompare(b.label));

    return overview ? [overview, ...others] : others;
  }, []);

  function handleUiLabToggle() {
    if (!showUiSection) {
      setIsUiOpen(true);

      if (!isUiLab) {
        router.push("/admin/ui");
      }

      return;
    }

    setIsUiOpen(false);
  }

  return (
    <aside className="flex h-full min-h-0 flex-col bg-[var(--background-elevated)]">
      <div className="shrink-0 border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background-muted)] text-[var(--brand-blue)]">
            <AppIcon icon="settings" size={16} />
          </div>

          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Admin Panel
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Management</div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <nav className="flex flex-col gap-5">
          <SidebarSection title="Overview">
            <Link href="/admin" className={getNavItemClass(isDashboard)}>
              <AppIcon icon="dashboard" size={18} />
              <span className="flex-1 text-left">Dashboard</span>
            </Link>
          </SidebarSection>

          <SidebarSection title="Design">
            <button
              type="button"
              onClick={handleUiLabToggle}
              className={[
                getNavItemClass(isUiLab),
                "justify-between !text-[var(--text-primary)]",
              ].join(" ")}
              aria-expanded={showUiSection}
              aria-controls="admin-ui-lab-section"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <AppIcon icon="uiLab" size={18} />
                <span className="flex-1 text-left text-sm font-inherit text-[var(--text-primary)]">
                  UI Lab
                </span>
              </div>
              <AppIcon
                icon={showUiSection ? "down" : "next"}
                size={16}
                className="text-[var(--text-primary)]"
              />
            </button>

            {showUiSection ? (
              <div
                id="admin-ui-lab-section"
                className="ml-4 space-y-1 border-l border-[var(--border)] pl-3"
              >
                {sortedUiLabPages.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={getNavItemClass(isActive, true)}
                    >
                      <AppIcon icon={getUiLabItemIcon(item.label)} size={16} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </SidebarSection>

          <SidebarSection title="Content">
            <Link href="/admin/content" className={getNavItemClass(isContent)}>
              <AppIcon icon="courses" size={18} />
              <span className="flex-1 text-left">Courses / Modules / Lessons</span>
            </Link>

            <Link
              href="/admin/lesson-templates"
              className={getNavItemClass(isLessonTemplates)}
            >
              <AppIcon icon="file" size={18} />
              <span className="flex-1 text-left">Lesson Templates</span>
            </Link>

            <Link href="/admin/vocabulary" className={getNavItemClass(isVocabulary)}>
              <AppIcon icon="language" size={18} />
              <span className="flex-1 text-left">Vocabulary</span>
            </Link>
          </SidebarSection>

          <SidebarSection title="Questions">
            <Link
              href="/admin/question-sets"
              className={getNavItemClass(isQuestionSets && !isQuestionTemplates)}
            >
              <AppIcon icon="help" size={18} />
              <span className="flex-1 text-left">Question Sets</span>
            </Link>

            <Link
              href="/admin/question-sets/templates"
              className={getNavItemClass(isQuestionTemplates)}
            >
              <AppIcon icon="file" size={18} />
              <span className="flex-1 text-left">Templates</span>
            </Link>
          </SidebarSection>

          <SidebarSection title="Teaching">
            <Link href="/teacher/assignments" className={getNavItemClass(isAssignments)}>
              <AppIcon icon="assignments" size={18} />
              <span className="flex-1 text-left">Assignments</span>
            </Link>

            <Link
              href="/admin/teaching-groups"
              className={getNavItemClass(isTeachingGroups)}
            >
              <AppIcon icon="users" size={18} />
              <span className="flex-1 text-left">Teaching Groups</span>
            </Link>
          </SidebarSection>

          <SidebarSection title="Users">
            <Link href="/admin/students" className={getNavItemClass(isStudents)}>
              <AppIcon icon="user" size={18} />
              <span className="flex-1 text-left">Students</span>
            </Link>

            <Link href="/admin/teachers" className={getNavItemClass(isTeachers)}>
              <AppIcon icon="users" size={18} />
              <span className="flex-1 text-left">Teachers</span>
            </Link>
          </SidebarSection>
        </nav>
      </div>

      <div className="shrink-0 border-t border-[var(--border)] px-4 py-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
