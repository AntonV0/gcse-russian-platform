import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { appIcons } from "@/lib/shared/icons";
import { getCourseByIdDb, getVariantByIdDb } from "@/lib/courses/course-helpers-db";
import { updateVariantAction } from "@/app/actions/admin/admin-content-actions";

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
        title={`Edit ${variant.title}`}
        description="Update variant details and ordering."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Variant settings
        </div>

        <form action={updateVariantAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />
          <input type="hidden" name="variantId" value={variant.id} />

          <FormField label="Title">
            <Input name="title" required defaultValue={variant.title} />
          </FormField>

          <FormField label="Slug">
            <Input name="slug" required defaultValue={variant.slug} />
          </FormField>

          <FormField label="Description">
            <Textarea
              name="description"
              rows={4}
              defaultValue={variant.description ?? ""}
            />
          </FormField>

          <FormField label="Position">
            <Input
              name="position"
              type="number"
              min="1"
              defaultValue={variant.position}
            />
          </FormField>

          <CheckboxField
            name="isActive"
            label="Active"
            defaultChecked={variant.is_active}
          />

          <CheckboxField
            name="isPublished"
            label="Published"
            defaultChecked={variant.is_published}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon="completed">
              Save variant
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
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
