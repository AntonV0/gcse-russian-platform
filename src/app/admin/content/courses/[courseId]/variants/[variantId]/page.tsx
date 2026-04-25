import BackNav from "@/components/ui/back-nav";
import ActiveStatusBadge from "@/components/ui/active-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";
import DangerZone from "@/components/ui/danger-zone";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";

import {
  getCourseByIdDb,
  getModulesByVariantIdDb,
  getVariantByIdDb,
} from "@/lib/courses/course-helpers-db";

import {
  archiveVariantAction,
  createModuleAction,
  moveModuleAction,
} from "@/app/actions/admin/admin-content-actions";

type AdminVariantDetailPageProps = {
  params: Promise<{
    courseId: string;
    variantId: string;
  }>;
};

export default async function AdminVariantDetailPage({
  params,
}: AdminVariantDetailPageProps) {
  const { courseId, variantId } = await params;

  const [course, variant, modules] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantByIdDb(variantId),
    getModulesByVariantIdDb(variantId),
  ]);

  if (!course || !variant || variant.course_id !== course.id) {
    return <main>Variant not found.</main>;
  }

  return (
    <main className="space-y-3">
      <BackNav
        items={[
          { href: "/admin/content", label: "Content" },
          {
            href: `/admin/content/courses/${course.id}`,
            label: course.title,
          },
        ]}
      />

      <PageIntroPanel
        tone="admin"
        eyebrow="Variant"
        title={variant.title}
        description={variant.description ?? "Manage modules within this variant."}
        badges={
          <>
            <Badge tone="muted" icon="file">
              {variant.slug}
            </Badge>
            <ActiveStatusBadge isActive={variant.is_active} />
            <PublishStatusBadge isPublished={variant.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/variants/${variant.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit variant
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

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="space-y-3">
          <SectionCard
            title={`Modules (${modules.length})`}
            description="Manage structure and ordering of modules."
            tone="brand"
          >
            {modules.length === 0 ? (
              <EmptyState
                icon="lessonContent"
                title="No modules yet"
                description="Create your first module to begin structuring this variant."
              />
            ) : (
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <CardListItem
                    key={module.id}
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                    title={module.title}
                    subtitle={module.description || `Position ${module.position}`}
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
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-2">
                          <form action={moveModuleAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="moduleId" value={module.id} />
                            <input type="hidden" name="direction" value="up" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === 0}
                              icon="up"
                              iconOnly
                              ariaLabel="Move module up"
                            />
                          </form>

                          <form action={moveModuleAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="moduleId" value={module.id} />
                            <input type="hidden" name="direction" value="down" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === modules.length - 1}
                              icon="down"
                              iconOnly
                              ariaLabel="Move module down"
                            />
                          </form>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}/edit`}
                            size="sm"
                            variant="secondary"
                            icon="edit"
                          >
                            Edit
                          </Button>

                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}/modules/${module.id}`}
                            size="sm"
                            variant="quiet"
                            icon="next"
                            iconPosition="right"
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3">
          <ExpandableAdminFormPanel
            id="add-module"
            title="Add module"
            description="Create a new module within this variant."
            collapsedDescription="Create a new module within this variant."
            closedLabel="Add module"
            openLabel="Hide form"
            defaultOpen={modules.length === 0}
          >
            <form action={createModuleAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />
              <input type="hidden" name="variantId" value={variant.id} />

              <FormField label="Title">
                <Input name="title" required />
              </FormField>

              <FormField label="Slug">
                <Input name="slug" required />
              </FormField>

              <FormField label="Description">
                <Textarea name="description" rows={3} />
              </FormField>

              <CheckboxField name="isPublished" label="Published" />

              <Button type="submit" variant="primary" icon="create">
                Create module
              </Button>
            </form>
          </ExpandableAdminFormPanel>

          <DangerZone
            title="Archive variant"
            description="Archiving will disable and unpublish this variant without deleting its data."
            action={
              <form action={archiveVariantAction}>
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="variantId" value={variant.id} />
                <Button type="submit" variant="danger" icon="delete">
                  Archive variant
                </Button>
              </form>
            }
          />
        </div>
      </div>
    </main>
  );
}
