import Link from "next/link";
import LogoutButton from "@/components/layout/logout-button";

export default function AdminSidebar() {
  return (
    <aside className="flex flex-col border-r bg-white p-4">
      <div className="mb-6 text-lg font-semibold">Admin Panel</div>

      <nav className="flex flex-col gap-1 text-sm">
        <Link href="/admin" className="rounded px-3 py-2 hover:bg-gray-100">
          Dashboard
        </Link>

        <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase">
          Content
        </div>

        <Link href="/admin/content" className="rounded px-3 py-2 hover:bg-gray-100">
          Courses / Modules / Lessons
        </Link>

        <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase">
          Questions
        </div>

        <Link href="/admin/question-sets" className="rounded px-3 py-2 hover:bg-gray-100">
          Question Sets
        </Link>

        <Link href="/admin/templates" className="rounded px-3 py-2 hover:bg-gray-100">
          Templates
        </Link>

        <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase">
          Teaching
        </div>

        <Link href="/admin/assignments" className="rounded px-3 py-2 hover:bg-gray-100">
          Assignments
        </Link>

        <Link
          href="/admin/teaching-groups"
          className="rounded px-3 py-2 hover:bg-gray-100"
        >
          Teaching Groups
        </Link>

        <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase">
          Users
        </div>

        <Link href="/admin/students" className="rounded px-3 py-2 hover:bg-gray-100">
          Students
        </Link>

        <Link href="/admin/teachers" className="rounded px-3 py-2 hover:bg-gray-100">
          Teachers
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
