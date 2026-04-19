import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import CheckboxField from "@/components/ui/checkbox-field";
import { appIcons } from "@/lib/shared/icons";
import {
  getCourseByIdDb,
  getLessonByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import { updateLessonAction } from "@/app/actions/admin/admin-content-actions";

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

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
          variant="quiet"
          icon="back"
        >
          Back to {module.title}
        </Button>

        <Button
          href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
          variant="quiet"
          icon="back"
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

          <FormField label="Title">
            <Input name="title" required defaultValue={lesson.title} />
          </FormField>

          <FormField label="Slug">
            <Input name="slug" required defaultValue={lesson.slug} />
          </FormField>

          <FormField label="Summary">
            <Textarea name="summary" rows={4} defaultValue={lesson.summary ?? ""} />
          </FormField>

          <FormField label="Lesson type">
            <Input name="lessonType" defaultValue={lesson.lesson_type} />
          </FormField>

          <FormField label="Position">
            <Input name="position" type="number" min="1" defaultValue={lesson.position} />
          </FormField>

          <FormField label="Estimated minutes">
            <Input
              name="estimatedMinutes"
              type="number"
              min="1"
              defaultValue={lesson.estimated_minutes ?? ""}
            />
          </FormField>

          <FormField label="Content source">
            <Select name="contentSource" defaultValue={lesson.content_source}>
              <option value="code">code</option>
              <option value="database">database</option>
            </Select>
          </FormField>

          <FormField label="Content key">
            <Input name="contentKey" defaultValue={lesson.content_key ?? ""} />
          </FormField>

          <CheckboxField
            name="isPublished"
            label="Published"
            defaultChecked={lesson.is_published}
          />

          <CheckboxField
            name="isTrialVisible"
            label="Trial visible"
            defaultChecked={lesson.is_trial_visible}
          />

          <CheckboxField
            name="requiresPaidAccess"
            label="Requires paid access"
            defaultChecked={lesson.requires_paid_access}
          />

          <CheckboxField
            name="availableInVolna"
            label="Available in Volna"
            defaultChecked={lesson.available_in_volna}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon="completed">
              Save lesson
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/lessons/${lesson.id}`}
              variant="secondary"
              icon="back"
            >
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
