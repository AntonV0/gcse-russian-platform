import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
import {
  getCourseByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import { updateModuleAction } from "@/app/actions/admin-content-actions";

type AdminModuleEditPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
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

export default async function AdminModuleEditPage({ params }: AdminModuleEditPageProps) {
  const { courseId, variantId, moduleId } = await params;

  const [course, variant, module] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id
  ) {
    return <main>Module not found.</main>;
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

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {module.title}
        </Button>
      </div>

      <PageHeader
        title={`Edit ${module.title}`}
        description="Update module details and ordering."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Module settings
        </div>

        <form action={updateModuleAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="moduleId" value={module.id} />

          <Field label="Title">
            <input
              name="title"
              required
              defaultValue={module.title}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Slug">
            <input
              name="slug"
              required
              defaultValue={module.slug}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              defaultValue={module.description ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Position">
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={module.position}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={module.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon={appIcons.completed}>
              Save module
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
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
