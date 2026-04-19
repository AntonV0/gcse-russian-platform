import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import {
  getCourseByIdDb,
  getModuleByIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";
import { updateModuleAction } from "@/app/actions/admin/admin-content-actions";

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
      </div>

      <PageHeader
        title={`Edit ${module.title}`}
        description="Update module details and ordering."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Module settings
        </div>

        <form action={updateModuleAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />
          <input type="hidden" name="moduleId" value={module.id} />

          <FormField label="Title">
            <Input name="title" required defaultValue={module.title} />
          </FormField>

          <FormField label="Slug">
            <Input name="slug" required defaultValue={module.slug} />
          </FormField>

          <FormField label="Description">
            <Textarea
              name="description"
              rows={4}
              defaultValue={module.description ?? ""}
            />
          </FormField>

          <FormField label="Position">
            <Input name="position" type="number" min="1" defaultValue={module.position} />
          </FormField>

          <CheckboxField
            name="isPublished"
            label="Published"
            defaultChecked={module.is_published}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon="completed">
              Save module
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
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
