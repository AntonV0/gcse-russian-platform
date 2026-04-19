import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";
import {
  getCourseByIdDb,
  getLessonsByModuleIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import {
  createLessonAction,
  moveLessonAction,
  unpublishModuleAction,
} from "@/app/actions/admin/admin-content-actions";
import SectionCard from "@/components/ui/section-card";

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
    <main className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button href="/admin/content" variant="quiet" icon="back">
          Back to content
        </Button>

        <Button href={`/admin/content/courses/${course.id}`} variant="quiet" icon="back">
          Back to {course.title}
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
          variant="quiet"
          icon="back"
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
              <Badge tone={module.is_published ? "info" : "muted"} icon="preview">
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
              icon="edit"
            >
              Edit module
            </Button>

            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}`}
              variant="secondary"
              icon="preview"
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

            <FormField label="Title">
              <Input name="title" required />
            </FormField>

            <FormField label="Slug">
              <Input name="slug" required />
            </FormField>

            <FormField label="Summary">
              <Textarea name="summary" rows={3} />
            </FormField>

            <FormField label="Lesson type">
              <Input name="lessonType" defaultValue="lesson" />
            </FormField>

            <FormField label="Estimated minutes">
              <Input name="estimatedMinutes" type="number" min="1" />
            </FormField>

            <FormField label="Content source">
              <Select name="contentSource" defaultValue="code">
                <option value="code">code</option>
                <option value="database">database</option>
              </Select>
            </FormField>

            <FormField label="Content key">
              <Input name="contentKey" />
            </FormField>

            <div className="space-y-2">
              <CheckboxField name="isPublished" label="Published" />
              <CheckboxField name="isTrialVisible" label="Trial visible" />
              <CheckboxField
                name="requiresPaidAccess"
                label="Requires paid access"
                defaultChecked
              />
              <CheckboxField name="availableInVolna" label="Available in Volna" />
            </div>

            <Button type="submit" variant="primary" icon="create">
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
            <Button type="submit" variant="danger" icon="delete">
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
                className="flex items-start justify-between gap-4 rounded-xl border p-4"
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
                    <Badge tone={lesson.is_published ? "info" : "muted"} icon="preview">
                      {lesson.is_published ? "Published" : "Draft"}
                    </Badge>

                    <Badge
                      tone={lesson.is_trial_visible ? "success" : "muted"}
                      icon="help"
                    >
                      {lesson.is_trial_visible ? "Trial" : "No Trial"}
                    </Badge>

                    <Badge
                      tone={lesson.available_in_volna ? "success" : "muted"}
                      icon="users"
                    >
                      {lesson.available_in_volna ? "Volna" : "No Volna"}
                    </Badge>

                    <Badge tone="muted" icon="file">
                      {lesson.content_source}
                    </Badge>
                  </div>
                </a>

                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-2">
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
                        icon="up"
                        iconOnly
                        ariaLabel="Move lesson up"
                      />
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
                        icon="down"
                        iconOnly
                        ariaLabel="Move lesson down"
                      />
                    </form>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                      size="sm"
                      variant="secondary"
                      icon="edit"
                    >
                      Edit
                    </Button>

                    <Button
                      href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
                      size="sm"
                      variant="secondary"
                      icon="preview"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </main>
  );
}
