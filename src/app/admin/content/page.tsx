import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCoursesDb } from "@/lib/course-helpers-db";
import { createCourseAction } from "@/app/actions/admin-content-actions";

export default async function AdminContentPage() {
  const courses = await getCoursesDb();

  return (
    <main>
      <PageHeader
        title="Content Management"
        description="Manage courses, variants, modules, and lessons."
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Courses</div>

          <div className="divide-y">
            {courses.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">No courses found.</div>
            ) : (
              courses.map((course) => (
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
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Add Course</div>

          <form action={createCourseAction} className="space-y-4 px-4 py-4 text-sm">
            <div>
              <label className="mb-1 block font-medium">Title</label>
              <input name="title" required className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="mb-1 block font-medium">Slug</label>
              <input name="slug" required className="w-full rounded border px-3 py-2" />
            </div>

            <div>
              <label className="mb-1 block font-medium">Description</label>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" value="true" defaultChecked />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>

            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Create course
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
