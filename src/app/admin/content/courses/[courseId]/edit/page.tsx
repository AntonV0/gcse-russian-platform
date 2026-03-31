import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCourseByIdDb } from "@/lib/course-helpers-db";
import { updateCourseAction } from "@/app/actions/admin-content-actions";

type AdminCourseEditPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params;

  const course = await getCourseByIdDb(courseId);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main>
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/content" className="text-blue-600 hover:underline">
          ← Back to content
        </Link>

        <Link
          href={`/admin/content/courses/${course.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {course.title}
        </Link>
      </div>

      <PageHeader
        title={`Edit ${course.title}`}
        description="Update course title, slug, description, and visibility settings."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Course Settings</div>

        <form action={updateCourseAction} className="space-y-4 px-4 py-4 text-sm">
          <input type="hidden" name="courseId" value={course.id} />

          <div>
            <label className="mb-1 block font-medium">Title</label>
            <input
              name="title"
              required
              defaultValue={course.title}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Slug</label>
            <input
              name="slug"
              required
              defaultValue={course.slug}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={course.description ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={course.is_active}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={course.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Save course
            </button>

            <Link
              href={`/admin/content/courses/${course.id}`}
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
