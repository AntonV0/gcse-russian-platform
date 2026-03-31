import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getLessonsByModuleIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import {
  createLessonAction,
  moveLessonAction,
} from "@/app/actions/admin-content-actions";

type AdminModuleDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
  }>;
};

export default async function AdminModuleDetailPage({
  params,
}: AdminModuleDetailPageProps) {
  const { courseId, variantId, moduleId } = await params;

  const [course, variant, module, lessons] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonsByModuleIdDb(moduleId),
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
      </div>

      <PageHeader
        title={module.title}
        description={module.description ?? "Manage lessons in this module."}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Module Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Course:</span> {course.title}
            </div>
            <div>
              <span className="font-medium">Variant:</span> {variant.title}
            </div>
            <div>
              <span className="font-medium">Title:</span> {module.title}
            </div>
            <div>
              <span className="font-medium">Slug:</span> {module.slug}
            </div>
            <div>
              <span className="font-medium">Position:</span> {module.position}
            </div>
            <div>
              <span className="font-medium">Published:</span>{" "}
              {module.is_published ? "Yes" : "No"}
            </div>
            {module.description ? (
              <div>
                <span className="font-medium">Description:</span> {module.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/edit`}
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit module
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <details className="rounded-lg border bg-white">
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium marker:content-none">
            <span>Add Lesson</span>
            <span className="text-sm text-gray-400">+</span>
          </summary>

          <div className="border-t">
            <form action={createLessonAction} className="space-y-4 px-4 py-4 text-sm">
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="variantId" value={variant.id} />
              <input type="hidden" name="moduleId" value={module.id} />

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
                <label className="mb-1 block font-medium">Summary</label>
                <textarea
                  name="summary"
                  rows={3}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Lesson type</label>
                <input
                  name="lessonType"
                  defaultValue="lesson"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Estimated minutes</label>
                <input
                  name="estimatedMinutes"
                  type="number"
                  min="1"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Content source</label>
                <select
                  name="contentSource"
                  defaultValue="code"
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="code">code</option>
                  <option value="database">database</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">Content key</label>
                <input name="contentKey" className="w-full rounded border px-3 py-2" />
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isPublished" value="true" />
                Published
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="isTrialVisible" value="true" />
                Trial visible
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="requiresPaidAccess"
                  value="true"
                  defaultChecked
                />
                Requires paid access
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="availableInVolna" value="true" />
                Available in Volna
              </label>

              <button type="submit" className="rounded border px-4 py-2 hover:bg-gray-50">
                Create lesson
              </button>
            </form>
          </div>
        </details>
      </section>

      <section>
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Lessons</div>

          <div className="divide-y">
            {lessons.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No lessons found for this module.
              </div>
            ) : (
              lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <Link
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                    className="min-w-0 flex-1 hover:text-blue-600"
                  >
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">
                      {lesson.slug} · Position {lesson.position}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <form action={moveLessonAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="lessonId" value={lesson.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↑
                      </button>
                    </form>

                    <form action={moveLessonAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="variantId" value={variant.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="lessonId" value={lesson.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === lessons.length - 1}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </form>

                    <Link
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
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
