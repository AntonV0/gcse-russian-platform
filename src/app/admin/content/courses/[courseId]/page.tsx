import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { getCourseByIdDb, getVariantsByCourseIdDb } from "@/lib/course-helpers-db";
import {
  createVariantAction,
  moveVariantAction,
} from "@/app/actions/admin-content-actions";

type AdminCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseDetailPage({
  params,
}: AdminCourseDetailPageProps) {
  const { courseId } = await params;

  const [course, variants] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantsByCourseIdDb(courseId),
  ]);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/content" className="text-sm text-blue-600 hover:underline">
          ← Back to content
        </Link>
      </div>

      <PageHeader
        title={course.title}
        description={course.description ?? "Manage course variants and structure."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Course Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Title:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {course.slug}
            </div>
            <div>
              <span className="font-medium">Active:</span>{" "}
              {course.is_active ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {course.is_published ? "Yes" : "No"}
            </div>
            {course.description ? (
              <div>
                <span className="font-medium">Description:</span> {course.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <Link
              href={`/admin/content/courses/${course.id}/edit`}
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit course
            </Link>

            <Link
              href={`/courses/${course.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Open public course
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <details className="rounded-lg border bg-white">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium marker:content-none">
            <span>Add Variant</span>
            <span className="text-sm text-gray-400">+</span>
          </summary>

          <div className="border-t">
            <form action={createVariantAction} className="space-y-4 px-4 py-4 text-sm">
              <input type="hidden" name="courseId" value={course.id} />

              <div>
                <label className="mb-1 block font-medium">Title</label>
                <input
                  name="title"
                  required
                  className="w-full rounded border px-3 py-2"
                />
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

              <button type="submit" className="rounded border px-4 py-2 hover:bg-gray-50">
                Create variant
              </button>
            </form>
          </div>
        </details>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Variants</div>

          <div className="divide-y">
            {variants.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No variants found for this course.
              </div>
            ) : (
              variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <Link
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                    className="min-w-0 flex-1 hover:text-blue-600"
                  >
                    <div className="font-medium">{variant.title}</div>
                    <div className="text-sm text-gray-500">
                      {variant.slug} · Position {variant.position}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      <span className="rounded border px-2 py-0.5">
                        {variant.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="rounded border px-2 py-0.5">
                        {variant.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <form action={moveVariantAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↑
                      </button>
                    </form>

                    <form action={moveVariantAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === variants.length - 1}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </form>

                    <Link
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
