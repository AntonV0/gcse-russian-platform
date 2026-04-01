"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/layout/logout-button";

function getNavItemClass(isActive: boolean) {
  return [
    "rounded px-3 py-2 transition",
    isActive ? "bg-gray-100 font-medium text-black" : "hover:bg-gray-100 text-black",
  ].join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isContent = pathname.startsWith("/admin/content");
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
          Dashboard
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Content
        </div>

        <Link href="/admin/content" className={getNavItemClass(isContent)}>
          Courses / Modules / Lessons
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Questions
        </div>

        <Link
          href="/admin/question-sets"
          className={getNavItemClass(isQuestionSets && !isTemplates)}
        >
          Question Sets
        </Link>

        <Link
          href="/admin/question-sets/templates"
          className={getNavItemClass(isTemplates)}
        >
          Templates
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Teaching
        </div>

        <Link href="/teacher/assignments" className={getNavItemClass(isAssignments)}>
          Assignments
        </Link>

        <Link href="/admin/teaching-groups" className={getNavItemClass(isTeachingGroups)}>
          Teaching Groups
        </Link>

        <div className="mb-1 mt-4 px-3 text-xs font-semibold uppercase text-gray-400">
          Users
        </div>

        <Link href="/admin/students" className={getNavItemClass(isStudents)}>
          Students
        </Link>

        <Link href="/admin/teachers" className={getNavItemClass(isTeachers)}>
          Teachers
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
