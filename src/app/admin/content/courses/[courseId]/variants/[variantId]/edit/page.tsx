import BackNav from "@/components/ui/back-nav";
import ActiveStatusBadge from "@/components/ui/active-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
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
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/courses/${course.id}`, label: course.title },
          {
            href: `/admin/content/courses/${course.id}/variants/${variant.id}`,
            label: variant.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Variant settings"
        title={`Edit ${variant.title}`}
        description="Update variant details, visibility, and ordering."
        badges={
          <>
            <Badge tone="muted" icon="file">
              {variant.slug}
            </Badge>
            <Badge tone="muted">Position {variant.position}</Badge>
            <ActiveStatusBadge isActive={variant.is_active} />
            <PublishStatusBadge isPublished={variant.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
              variant="secondary"
              icon="back"
            >
              Back to variant
            </Button>
            <Button
              href={`/courses/${course.slug}/${variant.slug}`}
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
          title="Variant settings"
          description="Make structural and visibility changes to this variant."
          tone="brand"
        >
          <form action={updateVariantAction} className="space-y-4">
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="variantId" value={variant.id} />

            <FormField
              label="Title"
              description="Used across admin structure views and course navigation."
            >
              <Input name="title" required defaultValue={variant.title} />
            </FormField>

            <FormField label="Slug" description="Short internal URL-friendly identifier.">
              <Input name="slug" required defaultValue={variant.slug} />
            </FormField>

            <FormField
              label="Description"
              description="Optional summary shown in admin structure views and variant previews."
            >
              <Textarea
                name="description"
                rows={4}
                defaultValue={variant.description ?? ""}
              />
            </FormField>

            <FormField
              label="Position"
              description="Controls this variant’s ordering within the course."
            >
              <Input
                name="position"
                type="number"
                min="1"
                defaultValue={variant.position}
              />
            </FormField>

            <div className="space-y-2">
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
            </div>

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
        </SectionCard>

        <SectionCard
          title="Editing guidance"
          description="Keep variant structure clean before building deeper module and lesson content."
          tone="muted"
          density="compact"
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Keep titles distinct
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Variants should be easy to distinguish at a glance across admin and public
                structure views.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Use predictable ordering
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Position controls where this variant appears within the parent course.
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Review visibility states
              </div>
              <div className="mt-1 text-sm app-text-muted">
                Active and published states should match whether this variant is ready for
                use across the platform.
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
