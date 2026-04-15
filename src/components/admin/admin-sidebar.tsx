"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import { appIcons } from "@/lib/icons";

function getNavItemClass(isActive: boolean) {
  return [
    "flex items-center gap-2 rounded-xl px-3 py-2 transition",
    isActive ? "bg-gray-100 font-medium text-black" : "text-black hover:bg-gray-100",
  ].join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isContent = pathname.startsWith("/admin/content");
  const isUiLab = pathname.startsWith("/admin/ui");
  const isQuestionSets =
    pathname === "/admin/question-sets" || pathname.startsWith("/admin/question-sets/");
  const isTemplates = pathname === "/admin/question-sets/templates";
  const isAssignments = pathname.startsWith("/teacher/assignments");
  const isTeachingGroups = pathname.startsWith("/admin/teaching-groups");
  const isStudents = pathname.startsWith("/admin/students");
  const isTeachers = pathname.startsWith("/admin/teachers");

  return (
    <aside className="flex flex-col border-r bg-white p-4">
      <div className="mb-6 text-lg font-semibold">Admin Panel</div>

      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/admin" className={getNavItemClass(isDashboard)}>
          <AppIcon icon={appIcons.dashboard} size={18} />
          <span>Dashboard</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Design
        </div>

        <Link href="/admin/ui" className={getNavItemClass(isUiLab)}>
          <AppIcon icon={appIcons.uiLab} size={18} />
          <span>UI Lab</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Content
        </div>

        <Link href="/admin/content" className={getNavItemClass(isContent)}>
          <AppIcon icon={appIcons.courses} size={18} />
          <span>Courses / Modules / Lessons</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Questions
        </div>

        <Link
          href="/admin/question-sets"
          className={getNavItemClass(isQuestionSets && !isTemplates)}
        >
          <AppIcon icon={appIcons.help} size={18} />
          <span>Question Sets</span>
        </Link>

        <Link
          href="/admin/question-sets/templates"
          className={getNavItemClass(isTemplates)}
        >
          <AppIcon icon={appIcons.file} size={18} />
          <span>Templates</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Teaching
        </div>

        <Link href="/teacher/assignments" className={getNavItemClass(isAssignments)}>
          <AppIcon icon={appIcons.assignments} size={18} />
          <span>Assignments</span>
        </Link>

        <Link href="/admin/teaching-groups" className={getNavItemClass(isTeachingGroups)}>
          <AppIcon icon={appIcons.users} size={18} />
          <span>Teaching Groups</span>
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Users
        </div>

        <Link href="/admin/students" className={getNavItemClass(isStudents)}>
          <AppIcon icon={appIcons.user} size={18} />
          <span>Students</span>
        </Link>

        <Link href="/admin/teachers" className={getNavItemClass(isTeachers)}>
          <AppIcon icon={appIcons.users} size={18} />
          <span>Teachers</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
