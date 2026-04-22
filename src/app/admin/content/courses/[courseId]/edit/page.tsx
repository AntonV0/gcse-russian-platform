import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import { getCourseByIdDb } from "@/lib/courses/course-helpers-db";
import { updateCourseAction } from "@/app/actions/admin/admin-content-actions";

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
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Back to content" },
          {
            href: `/admin/content/courses/${course.id}`,
            label: `Back to ${course.title}`,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Course settings"
        title={`Edit ${course.title}`}
        description="Update course title, slug, description, and visibility settings."
        badges={
          <>
            <Badge tone="muted" icon="file">
              {course.slug}
            </Badge>
            <Badge
              tone={course.is_active ? "success" : "warning"}
              icon={course.is_active ? "completed" : "pending"}
            >
              {course.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge tone={course.is_published ? "info" : "muted"} icon="preview">
              {course.is_published ? "Published" : "Draft"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}`}
              variant="secondary"
              icon="back"
            >
              Back to course
            </Button>
            <Button href={`/courses/${course.slug}`} variant="secondary" icon="preview">
              Open public course
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
        <SectionCard
          title="Course settings"
          description="Make structural and visibility changes to this course."
          tone="brand"
        >
          <form action={updateCourseAction} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />

            <FormField
              label="Title"
              description="Used across admin navigation, content listings, and the public course view."
            >
              <Input name="title" required defaultValue={course.title} />
            </FormField>

            <FormField label="Slug" description="Short internal URL-friendly identifier.">
              <Input name="slug" required defaultValue={course.slug} />
            </FormField>

            <FormField
              label="Description"
              description="Optional summary used in course listings and admin previews."
            >
              <Textarea
                name="description"
                rows={4}
                defaultValue={course.description ?? ""}
              />
            </FormField>

            <div className="space-y-2">
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
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="primary" icon="completed">
                Save course
              </Button>

              <Button
                href={`/admin/content/courses/${course.id}`}
                variant="secondary"
                icon="back"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Editing guidance"
          description="Keep this course clean and predictable before building deeper structure."
          tone="muted"
          density="compact"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Keep titles stable
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Course titles appear across admin and public-facing areas, so rename with
                care.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Use clear slugs
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Slugs should stay short, readable, and consistent with the course title.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Check visibility settings
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Active and published states control whether this course should be visible
                and usable across the platform.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
