import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import { getCourseByIdDb, getVariantByIdDb } from "@/lib/course-helpers-db";
import { updateVariantAction } from "@/app/actions/admin-content-actions";

type AdminVariantEditPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
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

export default async function AdminVariantEditPage({
  params,
}: AdminVariantEditPageProps) {
  const { courseId, variantId } = await params;

  const [course, variant] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
  ]);

  if (!course || !variant || variant.course_id !== course.id) {
    return <main>Variant not found.</main>;
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

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {variant.title}
        </Button>
      </div>

      <PageHeader
        title={`Edit ${variant.title}`}
        description="Update variant details and ordering."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Variant settings
        </div>

        <form action={updateVariantAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />

          <Field label="Title">
            <input
              name="title"
              required
              defaultValue={variant.title}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Slug">
            <input
              name="slug"
              required
              defaultValue={variant.slug}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              defaultValue={variant.description ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Position">
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={variant.position}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={variant.is_active}
            />
            Active
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={variant.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon={appIcons.completed}>
              Save variant
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
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
