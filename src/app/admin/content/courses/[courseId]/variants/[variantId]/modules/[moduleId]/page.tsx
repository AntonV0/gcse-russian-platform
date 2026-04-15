import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";
import {
  getCourseByIdDb,
  getLessonsByModuleIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/course-helpers-db";
import {
  createLessonAction,
  moveLessonAction,
  unpublishModuleAction,
} from "@/app/actions/admin-content-actions";

type AdminModuleDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
    moduleId: string;
  }>;
};

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">{label}</label>
      {children}
    </div>
  );
}

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
        title={module.title}
        description={module.description ?? "Manage lessons in this module."}
      />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SectionCard title="Module details">
          <div className="space-y-3 text-sm">
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

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge
                tone={module.is_published ? "info" : "muted"}
                icon={appIcons.preview}
              >
                {module.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            {module.description ? (
              <div>
                <span className="font-medium">Description:</span> {module.description}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard title="Actions">
          <div className="flex flex-col gap-3">
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/edit`}
              variant="secondary"
              icon={appIcons.edit}
            >
              Edit module
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}`}
              variant="secondary"
              icon={appIcons.preview}
            >
              Open public module
            </Button>
          </div>
        </SectionCard>
      </section>

      <details className="rounded-2xl border bg-white shadow-sm">
        <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-gray-900">
          Add Lesson
        </summary>

        <div className="border-t p-5">
          <form action={createLessonAction} className="space-y-4 text-sm">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <input type="hidden" name="moduleId" value={module.id} />

            <Field label="Title">
              <input
                name="title"
                required
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                required
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Summary">
              <textarea
                name="summary"
                rows={3}
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Lesson type">
              <input
                name="lessonType"
                defaultValue="lesson"
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Estimated minutes">
              <input
                name="estimatedMinutes"
                type="number"
                min="1"
                className="w-full rounded-xl border px-3 py-2"
              />
            </Field>

            <Field label="Content source">
              <select
                name="contentSource"
                defaultValue="code"
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="code">code</option>
                <option value="database">database</option>
              </select>
            </Field>

            <Field label="Content key">
              <input name="contentKey" className="w-full rounded-xl border px-3 py-2" />
            </Field>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="isTrialVisible" value="true" />
              Trial visible
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="requiresPaidAccess"
                value="true"
                defaultChecked
              />
              Requires paid access
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="availableInVolna" value="true" />
              Available in Volna
            </label>

            <Button type="submit" variant="primary" icon={appIcons.create}>
              Create lesson
            </Button>
          </form>
        </div>
      </details>

      <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-200 px-5 py-4 font-semibold text-red-700">
          Danger zone
        </div>

        <div className="space-y-3 p-5 text-sm">
          <p className="text-gray-600">
            Unpublishing this module will hide it from normal public use, but it will not
            hard delete its data.
          </p>

          <form action={unpublishModuleAction}>
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <input type="hidden" name="moduleId" value={module.id} />
            <Button type="submit" variant="danger" icon={appIcons.delete}>
              Unpublish module
            </Button>
          </form>
        </div>
      </section>

      <SectionCard title={`Lessons (${lessons.length})`}>
        <div className="space-y-3">
          {lessons.length === 0 ? (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-gray-500">
              No lessons found for this module.
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between gap-4 rounded-xl border p-4"
              >
                <a
                  href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                  className="min-w-0 flex-1"
                >
                  <div className="font-medium text-gray-900">{lesson.title}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {lesson.slug} · Position {lesson.position}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <Badge
                      tone={lesson.is_published ? "info" : "muted"}
                      icon={appIcons.preview}
                    >
                      {lesson.is_published ? "Published" : "Draft"}
                    </Badge>

                    <Badge
                      tone={lesson.is_trial_visible ? "success" : "muted"}
                      icon={appIcons.help}
                    >
                      {lesson.is_trial_visible ? "Trial" : "No Trial"}
                    </Badge>

                    <Badge
                      tone={lesson.available_in_volna ? "success" : "muted"}
                      icon={appIcons.users}
                    >
                      {lesson.available_in_volna ? "Volna" : "No Volna"}
                    </Badge>

                    <Badge tone="muted" icon={appIcons.file}>
                      {lesson.content_source}
                    </Badge>
                  </div>
                </a>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={moveLessonAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="variantId" value={variant.id} />
                    <input type="hidden" name="moduleId" value={module.id} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <input type="hidden" name="direction" value="up" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={index === 0}
                      icon={appIcons.back}
                    >
                      Up
                    </Button>
                  </form>

                  <form action={moveLessonAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="variantId" value={variant.id} />
                    <input type="hidden" name="moduleId" value={module.id} />
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <input type="hidden" name="direction" value="down" />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={index === lessons.length - 1}
                      icon={appIcons.next}
                    >
                      Down
                    </Button>
                  </form>

                  <Button
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                    size="sm"
                    variant="secondary"
                    icon={appIcons.edit}
                  >
                    Edit
                  </Button>

                  <Button
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                    size="sm"
                    variant="secondary"
                    icon={appIcons.preview}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </main>
  );
}
