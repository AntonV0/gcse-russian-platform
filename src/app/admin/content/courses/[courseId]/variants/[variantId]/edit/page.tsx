import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCourseByIdDb, getVariantByIdDb } from "@/lib/course-helpers-db";
import { updateVariantAction } from "@/app/actions/admin-content-actions";

type AdminVariantEditPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
  }>;
};

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
      </div>

      <PageHeader
        title={`Edit ${variant.title}`}
        description="Update variant details and ordering."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Variant Settings</div>

        <form action={updateVariantAction} className="space-y-4 px-4 py-4 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />

          <div>
            <label className="mb-1 block font-medium">Title</label>
            <input
              name="title"
              required
              defaultValue={variant.title}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Slug</label>
            <input
              name="slug"
              required
              defaultValue={variant.slug}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={variant.description ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Position</label>
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={variant.position}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={variant.is_active}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={variant.is_published}
            />
            Published
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Save variant
            </button>

            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
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
