import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { appIcons } from "@/lib/icons";
import { getCourseByIdDb } from "@/lib/course-helpers-db";
import { updateCourseAction } from "@/app/actions/admin-content-actions";

type AdminCourseEditPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseEditPage({ params }: AdminCourseEditPageProps) {
  const { courseId } = await params;

  const course = await getCourseByIdDb(courseId);

  if (!course) {
    return <main>Course not found.</main>;
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
      </div>

      <PageHeader
        title={`Edit ${course.title}`}
        description="Update course title, slug, description, and visibility settings."
      />

      <section className="max-w-3xl rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-semibold text-gray-900">
          Course settings
        </div>

        <form action={updateCourseAction} className="space-y-4 p-5 text-sm">
          <input type="hidden" name="courseId" value={course.id} />

          <FormField label="Title">
            <Input name="title" required defaultValue={course.title} />
          </FormField>

          <FormField label="Slug">
            <Input name="slug" required defaultValue={course.slug} />
          </FormField>

          <FormField label="Description">
            <Textarea
              name="description"
              rows={4}
              defaultValue={course.description ?? ""}
            />
          </FormField>

          <CheckboxField
            name="isActive"
            label="Active"
            defaultChecked={course.is_active}
          />

          <CheckboxField
            name="isPublished"
            label="Published"
            defaultChecked={course.is_published}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" variant="primary" icon={appIcons.completed}>
              Save course
            </Button>

            <Button
              href={`/admin/content/courses/${course.id}`}
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
