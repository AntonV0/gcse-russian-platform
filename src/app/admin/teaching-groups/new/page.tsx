import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import { createTeachingGroupAction } from "@/app/actions/admin/admin-teaching-group-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

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

export default async function AdminTeachingGroupNewPage() {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [{ data: courses }, { data: variants }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, slug")
      .order("title", { ascending: true }),
    supabase
      .from("course_variants")
      .select("id, course_id, title, slug")
      .order("title", { ascending: true }),
  ]);

  const courseRows = (courses ?? []) as CourseRow[];
  const variantRows = (variants ?? []) as VariantRow[];

  return (
    <main>
      <div className="mb-4">
        <Button href="/admin/teaching-groups" variant="quiet" size="sm" icon="back">
          Back to teaching groups
        </Button>
      </div>

      <PageHeader
        title="New Teaching Group"
        description="Create a teaching group and optionally link it to a course and variant."
      />

      <PanelCard
        title="Teaching group details"
        description="Link the group to the course and variant students should see in their guided Volna experience."
        tone="admin"
        className="max-w-3xl"
      >
        <form action={createTeachingGroupAction} className="space-y-4">
          <FormField label="Name" required>
            <Input name="name" required placeholder="Year 10 Saturday group" />
          </FormField>

          <FormField label="Linked course">
            <Select name="courseId">
              <option value="">No linked course</option>
              {courseRows.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Linked variant">
            <Select name="courseVariantId">
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
            description="Active groups can be used for teacher-led assignment workflows."
            defaultChecked
          />

          <InlineActions>
            <Button type="submit" variant="primary" icon="write">
              Create teaching group
            </Button>

            <Button href="/admin/teaching-groups" variant="secondary" icon="cancel">
              Cancel
            </Button>
          </InlineActions>
        </form>
      </PanelCard>
    </main>
  );
}
