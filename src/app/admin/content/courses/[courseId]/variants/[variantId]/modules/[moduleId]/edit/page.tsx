import BackNav from "@/components/ui/back-nav";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
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
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/courses/${course.id}`, label: course.title },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}`,
            label: variant.title,
          },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`,
            label: module.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Module settings"
        title={`Edit ${module.title}`}
        description="Update module details and ordering."
        badges={
          <>
            <Badge tone="muted" icon="file">
              {module.slug}
            </Badge>
            <Badge tone="muted">Position {module.position}</Badge>
            <PublishStatusBadge isPublished={module.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
              variant="secondary"
              icon="back"
            >
              Back to module
            </Button>
            <Button
              href={`/courses/${course.slug}/${variant.slug}/modules/${module.slug}`}
              variant="secondary"
              icon="preview"
            >
              Open public
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] xl:items-start">
        <SectionCard
          title="Module settings"
          description="Make structural and visibility changes to this module."
          tone="brand"
        >
          <form action={updateModuleAction} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />
            <input type="hidden" name="moduleId" value={module.id} />

            <FormField
              label="Title"
              description="Used across admin structure views and lesson navigation."
            >
              <Input name="title" required defaultValue={module.title} />
            </FormField>

            <FormField label="Slug" description="Short internal URL-friendly identifier.">
              <Input name="slug" required defaultValue={module.slug} />
            </FormField>

            <FormField
              label="Description"
              description="Optional summary shown in admin structure views and public module previews."
            >
              <Textarea
                name="description"
                rows={4}
                defaultValue={module.description ?? ""}
              />
            </FormField>

            <FormField
              label="Position"
              description="Controls this module’s ordering within the parent variant."
            >
              <Input
                name="position"
                type="number"
                min="1"
                defaultValue={module.position}
              />
            </FormField>

            <div className="space-y-2">
              <CheckboxField
                name="isPublished"
                label="Published"
                defaultChecked={module.is_published}
              />
            </div>

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
        </SectionCard>

        <SectionCard
          title="Editing guidance"
          description="Keep module structure clear before building detailed lesson content."
          tone="muted"
          density="compact"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Keep titles descriptive
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Module titles should make sense at a glance in both admin structure views
                and public navigation.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Use stable ordering
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Position controls where this module appears within the parent variant.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Publish when ready
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Keep draft modules unpublished until their lesson structure is ready for
                use.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
