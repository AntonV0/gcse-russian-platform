import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import { updateLessonAction } from "@/app/actions/admin-content-actions";

type AdminLessonEditPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
    lessonId: string;
  }>;
};

export default async function AdminLessonEditPage({ params }: AdminLessonEditPageProps) {
  const { courseId, variantId, moduleId, lessonId } = await params;

  const [course, variant, module, lesson] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModuleByIdDb(moduleId),
    getLessonByIdDb(lessonId),
  ]);

  if (
    !course ||
    !variant ||
    !module ||
    !lesson ||
    variant.course_id !== course.id ||
    module.course_variant_id !== variant.id ||
    lesson.module_id !== module.id
  ) {
    return <main>Lesson not found.</main>;
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

        <Link
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {lesson.title}
        </Link>
      </div>

      <PageHeader
        title={`Edit ${lesson.title}`}
        description="Update lesson metadata and access settings."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Lesson Settings</div>

        <form action={updateLessonAction} className="space-y-4 px-4 py-4 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="moduleId" value={module.id} />
          <input type="hidden" name="lessonId" value={lesson.id} />

          <div>
            <label className="mb-1 block font-medium">Title</label>
            <input
              name="title"
              required
              defaultValue={lesson.title}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Slug</label>
            <input
              name="slug"
              required
              defaultValue={lesson.slug}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Summary</label>
            <textarea
              name="summary"
              rows={4}
              defaultValue={lesson.summary ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Lesson type</label>
            <input
              name="lessonType"
              defaultValue={lesson.lesson_type}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Position</label>
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={lesson.position}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Estimated minutes</label>
            <input
              name="estimatedMinutes"
              type="number"
              min="1"
              defaultValue={lesson.estimated_minutes ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Content source</label>
            <select
              name="contentSource"
              defaultValue={lesson.content_source}
              className="w-full rounded border px-3 py-2"
            >
              <option value="code">code</option>
              <option value="database">database</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium">Content key</label>
            <input
              name="contentKey"
              defaultValue={lesson.content_key ?? ""}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={lesson.is_published}
            />
            Published
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isTrialVisible"
              value="true"
              defaultChecked={lesson.is_trial_visible}
            />
            Trial visible
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requiresPaidAccess"
              value="true"
              defaultChecked={lesson.requires_paid_access}
            />
            Requires paid access
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableInVolna"
              value="true"
              defaultChecked={lesson.available_in_volna}
            />
            Available in Volna
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Save lesson
            </button>

            <Link
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
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
