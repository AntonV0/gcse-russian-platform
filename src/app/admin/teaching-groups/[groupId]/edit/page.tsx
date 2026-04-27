import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import { updateTeachingGroupAction } from "@/app/actions/admin/admin-teaching-group-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

type TeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
};

type VariantRow = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
};

export default async function AdminTeachingGroupEditPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { groupId } = await params;
  const supabase = await createClient();

  const [{ data: group }, { data: courses }, { data: variants }] = await Promise.all([
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active")
      .eq("id", groupId)
      .maybeSingle(),
    supabase
      .from("courses")
      .select("id, title, slug")
      .order("title", { ascending: true }),
    supabase
      .from("course_variants")
      .select("id, course_id, title, slug")
      .order("title", { ascending: true }),
  ]);

  const teachingGroup = group as TeachingGroupRow | null;
  const courseRows = (courses ?? []) as CourseRow[];
  const variantRows = (variants ?? []) as VariantRow[];

  if (!teachingGroup) {
    return <main>Teaching group not found.</main>;
  }

  return (
    <main>
      <div className="mb-4 flex flex-wrap gap-3">
        <Button href="/admin/teaching-groups" variant="quiet" size="sm" icon="back">
          Back to teaching groups
        </Button>

        <Button
          href={`/admin/teaching-groups/${teachingGroup.id}`}
          variant="quiet"
          size="sm"
          icon="preview"
        >
          Back to {teachingGroup.name}
        </Button>
      </div>

      <PageHeader
        title={`Edit ${teachingGroup.name}`}
        description="Update teaching group details and links."
      />

      <PanelCard
        title="Teaching group settings"
        description="Keep the group name, active state, and linked learning path up to date."
        tone="admin"
        className="max-w-3xl"
      >
        <form action={updateTeachingGroupAction} className="space-y-4">
          <input type="hidden" name="groupId" value={teachingGroup.id} />

          <FormField label="Name" required>
            <Input name="name" required defaultValue={teachingGroup.name} />
          </FormField>

          <FormField label="Linked course">
            <Select name="courseId" defaultValue={teachingGroup.course_id ?? ""}>
              <option value="">No linked course</option>
              {courseRows.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Linked variant">
            <Select
              name="courseVariantId"
              defaultValue={teachingGroup.course_variant_id ?? ""}
            >
              <option value="">No linked variant</option>
              {variantRows.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </Select>
          </FormField>

          <CheckboxField
            name="isActive"
            label="Active"
            description="Inactive groups remain visible to admins but should not be used for new guided work."
            defaultChecked={teachingGroup.is_active}
          />

          <InlineActions>
            <Button type="submit" variant="primary" icon="save">
              Save teaching group
            </Button>

            <Button
              href={`/admin/teaching-groups/${teachingGroup.id}`}
              variant="secondary"
              icon="cancel"
            >
              Cancel
            </Button>
          </InlineActions>
        </form>
      </PanelCard>
    </main>
  );
}
