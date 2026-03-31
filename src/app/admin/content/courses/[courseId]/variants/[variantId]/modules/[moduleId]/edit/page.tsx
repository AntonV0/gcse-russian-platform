import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
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

        <Link
          href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {variant.title}
        </Link>

        <Link
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {module.title}
        </Link>
      </div>

      <PageHeader
        title={`Edit ${module.title}`}
        description="Update module details and ordering."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Module Settings</div>

        <form action={updateModuleAction} className="space-y-4 px-4 py-4 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="moduleId" value={module.id} />

          <div>
            <label className="mb-1 block font-medium">Title</label>
            <input
              name="title"
              required
              defaultValue={module.title}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Slug</label>
            <input
              name="slug"
              required
              defaultValue={module.slug}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={module.description ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Position</label>
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={module.position}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={module.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Save module
            </button>

            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
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
