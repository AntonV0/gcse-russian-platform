import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { getCourseByIdDb } from "@/lib/course-helpers-db";
import { updateCourseAction } from "@/app/actions/admin-content-actions";

type AdminCourseEditPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params;

  const course = await getCourseByIdDb(courseId);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button href="/admin/content" variant="quiet" icon={appIcons.back}>
          Back to content
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {course.title}
        </Button>
      </div>

      <PageHeader
        title={`Edit ${course.title}`}
        description="Update course title, slug, description, and visibility settings."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Course settings
        </div>

        <form action={updateCourseAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />

          <Field label="Title">
            <input
              name="title"
              required
              defaultValue={course.title}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Slug">
            <input
              name="slug"
              required
              defaultValue={course.slug}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              defaultValue={course.description ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={course.is_active}
            />
            Active
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={course.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon={appIcons.completed}>
              Save course
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}`}
              variant="secondary"
              icon={appIcons.back}
            >
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
