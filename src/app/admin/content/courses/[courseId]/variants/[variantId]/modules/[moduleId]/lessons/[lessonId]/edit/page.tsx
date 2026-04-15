import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

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

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
          variant="quiet"
          icon={appIcons.back}
        >
          Back to {lesson.title}
        </Button>
      </div>

      <PageHeader
        title={`Edit ${lesson.title}`}
        description="Update lesson metadata and access settings."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Lesson settings
        </div>

        <form action={updateLessonAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="moduleId" value={module.id} />
          <input type="hidden" name="lessonId" value={lesson.id} />

          <Field label="Title">
            <input
              name="title"
              required
              defaultValue={lesson.title}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Slug">
            <input
              name="slug"
              required
              defaultValue={lesson.slug}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Summary">
            <textarea
              name="summary"
              rows={4}
              defaultValue={lesson.summary ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Lesson type">
            <input
              name="lessonType"
              defaultValue={lesson.lesson_type}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Position">
            <input
              name="position"
              type="number"
              min="1"
              defaultValue={lesson.position}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Estimated minutes">
            <input
              name="estimatedMinutes"
              type="number"
              min="1"
              defaultValue={lesson.estimated_minutes ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <Field label="Content source">
            <select
              name="contentSource"
              defaultValue={lesson.content_source}
              className="w-full rounded-xl border px-3 py-2"
            >
              <option value="code">code</option>
              <option value="database">database</option>
            </select>
          </Field>

          <Field label="Content key">
            <input
              name="contentKey"
              defaultValue={lesson.content_key ?? ""}
              className="w-full rounded-xl border px-3 py-2"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={lesson.is_published}
            />
            Published
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isTrialVisible"
              value="true"
              defaultChecked={lesson.is_trial_visible}
            />
            Trial visible
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="requiresPaidAccess"
              value="true"
              defaultChecked={lesson.requires_paid_access}
            />
            Requires paid access
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="availableInVolna"
              value="true"
              defaultChecked={lesson.available_in_volna}
            />
            Available in Volna
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon={appIcons.completed}>
              Save lesson
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
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
