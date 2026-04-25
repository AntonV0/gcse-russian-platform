import ActiveStatusBadge from "@/components/ui/active-status-badge";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import ExpandableAdminFormPanel from "@/components/admin/expandable-admin-form-panel";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import CheckboxField from "@/components/ui/checkbox-field";
import BackNav from "@/components/ui/back-nav";
import {
  getCourseByIdDb,
  getVariantsByCourseIdDb,
} from "@/lib/courses/course-helpers-db";
import {
  createVariantAction,
  moveVariantAction,
} from "@/app/actions/admin/admin-content-actions";

type AdminCourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function AdminCourseDetailPage({
  params,
}: AdminCourseDetailPageProps) {
  const { courseId } = await params;

  const [course, variants] = await Promise.all([
    getCourseByIdDb(courseId),
    getVariantsByCourseIdDb(courseId),
  ]);

  if (!course) {
    return <main>Course not found.</main>;
  }

  return (
    <main className="space-y-3">
      <BackNav items={[{ href: "/admin/content", label: "Back to content" }]} />

      <PageIntroPanel
        tone="admin"
        eyebrow="Course structure"
        title={course.title}
        description={course.description ?? "Manage course variants and structure."}
        badges={
          <>
            <Badge tone="muted" icon="file">
              {course.slug}
            </Badge>
            <ActiveStatusBadge isActive={course.is_active} />
            <PublishStatusBadge isPublished={course.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/content/courses/${course.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit course
            </Button>
            <Button href={`/courses/${course.slug}`} variant="secondary" icon="preview">
              Open public course
            </Button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="space-y-3">
          <SectionCard
            title={`Variants (${variants.length})`}
            description="Select a variant to manage its modules, lessons, and settings."
            tone="brand"
          >
            {variants.length === 0 ? (
              <EmptyState
                icon="layers"
                iconTone="brand"
                title="No variants found"
                description="Create the first variant for this course to start building deeper structure."
                action={
                  <Button href="#add-variant" variant="primary" icon="create">
                    Add variant
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <CardListItem
                    key={variant.id}
                    href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
                    title={variant.title}
                    subtitle={
                      variant.description ||
                      `Position ${variant.position} in this course structure.`
                    }
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
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-2">
                          <form action={moveVariantAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="direction" value="up" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === 0}
                              icon="up"
                              iconOnly
                              ariaLabel="Move variant up"
                            />
                          </form>

                          <form action={moveVariantAction}>
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
                            <input type="hidden" name="direction" value="down" />
                            <Button
                              type="submit"
                              size="sm"
                              variant="secondary"
                              disabled={index === variants.length - 1}
                              icon="down"
                              iconOnly
                              ariaLabel="Move variant down"
                            />
                          </form>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}/edit`}
                            size="sm"
                            variant="secondary"
                            icon="edit"
                          >
                            Edit
                          </Button>

                          <Button
                            href={`/admin/content/courses/${course.id}/variants/${variant.id}`}
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
            id="add-variant"
            title="Add variant"
            description="Create a new variant for this course."
            collapsedDescription="Create a new variant for this course."
            openLabel="Hide form"
            closedLabel="Add variant"
            defaultOpen={variants.length === 0}
          >
            <form action={createVariantAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />

              <FormField
                label="Title"
                description="Used in admin structure views and student-facing course navigation."
              >
                <Input name="title" required placeholder="Foundation" />
              </FormField>

              <FormField
                label="Slug"
                description="Short internal URL-friendly identifier."
              >
                <Input name="slug" required placeholder="foundation" />
              </FormField>

              <FormField
                label="Description"
                description="Optional summary shown in admin and course structure views."
              >
                <Textarea
                  name="description"
                  rows={4}
                  placeholder="Core pathway for this course variant."
                />
              </FormField>

              <div className="space-y-2">
                <CheckboxField name="isActive" label="Active" defaultChecked />
                <CheckboxField name="isPublished" label="Published" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary" icon="create">
                  Create variant
                </Button>
              </div>
            </form>
          </ExpandableAdminFormPanel>
        </div>
      </div>
    </main>
  );
}
