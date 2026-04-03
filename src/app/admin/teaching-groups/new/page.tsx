import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { createTeachingGroupAction } from "@/app/actions/admin-teaching-group-actions";

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
        <Link
          href="/admin/teaching-groups"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to teaching groups
        </Link>
      </div>

      <PageHeader
        title="New Teaching Group"
        description="Create a teaching group and optionally link it to a course and variant."
      />

      <section className="max-w-3xl rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Teaching Group Details</div>

        <form action={createTeachingGroupAction} className="space-y-4 px-4 py-4 text-sm">
          <div>
            <label className="mb-1 block font-medium">Name</label>
            <input name="name" required className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="mb-1 block font-medium">Linked Course</label>
            <select name="courseId" className="w-full rounded border px-3 py-2">
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
            <select name="courseVariantId" className="w-full rounded border px-3 py-2">
              <option value="">No linked variant</option>
              {variantRows.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" value="true" defaultChecked />
            Active
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Create teaching group
            </button>

            <Link
              href="/admin/teaching-groups"
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
