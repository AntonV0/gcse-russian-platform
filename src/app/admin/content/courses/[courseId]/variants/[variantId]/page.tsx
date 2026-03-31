import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getModulesByVariantIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import {
  createModuleAction,
  moveModuleAction,
} from "@/app/actions/admin-content-actions";

type AdminVariantDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
  }>;
};

export default async function AdminVariantDetailPage({
  params,
}: AdminVariantDetailPageProps) {
  const { courseId, variantId } = await params;

  const [course, variant, modules] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModulesByVariantIdDb(variantId),
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
      </div>

      <PageHeader
        title={variant.title}
        description={variant.description ?? "Manage modules in this variant."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Variant Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Course:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Title:</span> {variant.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {variant.slug}
            </div>
            <div>
              <span className="font-medium">Position:</span> {variant.position}
            </div>
            <div>
              <span className="font-medium">Active:</span>{" "}
              {variant.is_active ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {variant.is_published ? "Yes" : "No"}
            </div>
            {variant.description ? (
              <div>
                <span className="font-medium">Description:</span> {variant.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/edit`}
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit variant
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <details className="rounded-lg border bg-white">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium marker:content-none">
            <span>Add Module</span>
            <span className="text-sm text-gray-400">+</span>
          </summary>

          <div className="border-t">
            <form action={createModuleAction} className="space-y-4 px-4 py-4 text-sm">
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="variantId" value={variant.id} />

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
                <input type="checkbox" name="isPublished" value="true" />
                Published
              </label>

              <button type="submit" className="rounded border px-4 py-2 hover:bg-gray-50">
                Create module
              </button>
            </form>
          </div>
        </details>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Modules</div>

          <div className="divide-y">
            {modules.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No modules found for this variant.
              </div>
            ) : (
              modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <Link
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                    className="min-w-0 flex-1 hover:text-blue-600"
                  >
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-500">
                      {module.slug} · Position {module.position}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <form action={moveModuleAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↑
                      </button>
                    </form>

                    <form action={moveModuleAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === modules.length - 1}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </form>

                    <Link
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
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
