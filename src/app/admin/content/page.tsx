import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCoursesDb } from "@/lib/course-helpers-db";

export default async function AdminContentPage() {
  const courses = await getCoursesDb();

  return (
    <main>
      <PageHeader
        title="Content Management"
        description="Manage courses, variants, modules, and lessons."
      />

      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-medium">Courses</div>

          {/* (Optional for now, will wire later) */}
          <button className="text-sm text-blue-600 hover:underline">+ Add Course</button>
        </div>

        <div className="divide-y">
          {courses.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">No courses found.</div>
          )}

          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/content/courses/${course.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-gray-500">{course.slug}</div>
              </div>

              <span className="text-sm text-gray-400">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
