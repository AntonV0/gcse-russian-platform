"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import { uiLabPages } from "@/lib/ui/ui-lab";

function getNavItemClass(isActive: boolean, isSubItem = false) {
  return [
    "flex items-center gap-2 transition",
    isSubItem ? "rounded-lg px-3 py-2 text-sm" : "rounded-xl px-3 py-2",
    isActive
      ? "bg-[var(--background-muted)] font-medium text-[var(--text-primary)]"
      : "text-[var(--text-primary)] hover:bg-[var(--background-muted)]",
  ].join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isContent = pathname.startsWith("/admin/content");
  const isUiLab = pathname.startsWith("/admin/ui");
  const isQuestionSets =
    pathname === "/admin/question-sets" || pathname.startsWith("/admin/question-sets/");
  const isQuestionTemplates = pathname === "/admin/question-sets/templates";
  const isLessonTemplates = pathname.startsWith("/admin/lesson-templates");
  const isAssignments = pathname.startsWith("/teacher/assignments");
  const isTeachingGroups = pathname.startsWith("/admin/teaching-groups");
  const isStudents = pathname.startsWith("/admin/students");
  const isTeachers = pathname.startsWith("/admin/teachers");

  const [isUiOpen, setIsUiOpen] = useState(false);
  const showUiSection = isUiLab || isUiOpen;

  return (
    <aside className="flex flex-col border-r bg-[var(--background-elevated)] p-4">
      <div className="mb-6 text-lg font-semibold text-[var(--text-primary)]">
        Admin Panel
      </div>

      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/admin" className={getNavItemClass(isDashboard)}>
          <AppIcon icon="dashboard" size={18} />
          <span>Dashboard</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Design
        </div>

        <button
          type="button"
          onClick={() => setIsUiOpen((current) => !current)}
          className={getNavItemClass(isUiLab)}
        >
          <AppIcon icon="uiLab" size={18} />
          <span className="flex-1 text-left">UI Lab</span>
          <AppIcon icon={showUiSection ? "down" : "next"} size={16} />
        </button>

        {showUiSection ? (
          <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-[var(--border)] pl-3">
            {uiLabPages.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getNavItemClass(isActive, true)}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Content
        </div>

        <Link href="/admin/content" className={getNavItemClass(isContent)}>
          <AppIcon icon="courses" size={18} />
          <span>Courses / Modules / Lessons</span>
        </Link>

        <Link
          href="/admin/lesson-templates"
          className={getNavItemClass(isLessonTemplates)}
        >
          <AppIcon icon="file" size={18} />
          <span>Lesson Templates</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Questions
        </div>

        <Link
          href="/admin/question-sets"
          className={getNavItemClass(isQuestionSets && !isQuestionTemplates)}
        >
          <AppIcon icon="help" size={18} />
          <span>Question Sets</span>
        </Link>

        <Link
          href="/admin/question-sets/templates"
          className={getNavItemClass(isQuestionTemplates)}
        >
          <AppIcon icon="file" size={18} />
          <span>Templates</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Teaching
        </div>

        <Link href="/teacher/assignments" className={getNavItemClass(isAssignments)}>
          <AppIcon icon="assignments" size={18} />
          <span>Assignments</span>
        </Link>

        <Link href="/admin/teaching-groups" className={getNavItemClass(isTeachingGroups)}>
          <AppIcon icon="users" size={18} />
          <span>Teaching Groups</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide app-text-soft">
          Users
        </div>

        <Link href="/admin/students" className={getNavItemClass(isStudents)}>
          <AppIcon icon="user" size={18} />
          <span>Students</span>
        </Link>

        <Link href="/admin/teachers" className={getNavItemClass(isTeachers)}>
          <AppIcon icon="users" size={18} />
          <span>Teachers</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
