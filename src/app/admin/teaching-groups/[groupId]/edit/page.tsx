import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { updateTeachingGroupAction } from "@/app/actions/admin/admin-teaching-group-actions";

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
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/teaching-groups" className="text-blue-600 hover:underline">
          ← Back to teaching groups
        </Link>

        <Link
          href={`/admin/teaching-groups/${teachingGroup.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to {teachingGroup.name}
        </Link>
      </div>

      <PageHeader
        title={`Edit ${teachingGroup.name}`}
        description="Update teaching group details and links."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Teaching Group Settings</div>

        <form action={updateTeachingGroupAction} className="space-y-4 px-4 py-4 text-sm">
          <input type="hidden" name="groupId" value={teachingGroup.id} />

          <div>
            <label className="mb-1 block font-medium">Name</label>
            <input
              name="name"
              required
              defaultValue={teachingGroup.name}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Linked Course</label>
            <select
              name="courseId"
              defaultValue={teachingGroup.course_id ?? ""}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">No linked course</option>
              {courseRows.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium">Linked Variant</label>
            <select
              name="courseVariantId"
              defaultValue={teachingGroup.course_variant_id ?? ""}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">No linked variant</option>
              {variantRows.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={teachingGroup.is_active}
            />
            Active
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Save teaching group
            </button>

            <Link
              href={`/admin/teaching-groups/${teachingGroup.id}`}
              className="rounded border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
