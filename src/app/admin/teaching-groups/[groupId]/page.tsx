import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type TeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

type TeachingGroupMemberRow = {
  user_id: string;
  group_id: string;
  member_role: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
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

function getPersonLabel(
  profile: Pick<ProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminTeachingGroupDetailPage({
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

  const [
    { data: group },
    { data: memberships },
    { data: profiles },
    { data: courses },
    { data: variants },
  ] = await Promise.all([
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active")
      .eq("id", groupId)
      .maybeSingle(),
    supabase
      .from("teaching_group_members")
      .select("user_id, group_id, member_role")
      .eq("group_id", groupId),
    supabase.from("profiles").select("id, email, full_name, display_name, is_admin"),
    supabase.from("courses").select("id, title, slug"),
    supabase.from("course_variants").select("id, course_id, title, slug"),
  ]);

  const teachingGroup = group as TeachingGroupRow | null;
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];
  const profileRows = (profiles ?? []) as ProfileRow[];
  const courseRows = (courses ?? []) as CourseRow[];
  const variantRows = (variants ?? []) as VariantRow[];

  if (!teachingGroup) {
    return <main>Teaching group not found.</main>;
  }

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile]));
  const courseMap = new Map(courseRows.map((course) => [course.id, course]));
  const variantMap = new Map(variantRows.map((variant) => [variant.id, variant]));

  const linkedCourse = teachingGroup.course_id
    ? (courseMap.get(teachingGroup.course_id) ?? null)
    : null;

  const linkedVariant = teachingGroup.course_variant_id
    ? (variantMap.get(teachingGroup.course_variant_id) ?? null)
    : null;

  const teachers = membershipRows.filter((member) => member.member_role === "teacher");
  const students = membershipRows.filter((member) => member.member_role === "student");

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
        title={teachingGroup.name}
        description="Teaching group overview and membership."
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Group Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {teachingGroup.name}
            </div>
            <div>
              <span className="font-medium">Active:</span>{" "}
              {teachingGroup.is_active ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Linked course:</span>{" "}
              {linkedCourse ? linkedCourse.title : "—"}
            </div>
            <div>
              <span className="font-medium">Linked variant:</span>{" "}
              {linkedVariant ? linkedVariant.title : "—"}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="flex flex-col gap-3 px-4 py-4 text-sm">
            <Link
              href={`/admin/teaching-groups/${teachingGroup.id}/edit`}
              className="rounded border px-3 py-2 text-left hover:bg-gray-50"
            >
              Edit teaching group
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Teachers ({teachers.length})</div>

        <div className="divide-y">
          {teachers.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teacher members found.
            </div>
          ) : (
            teachers.map((member) => {
              const profile = profileMap.get(member.user_id);

              return (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between gap-4 px-4 py-4 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {profile ? getPersonLabel(profile) : member.user_id}
                    </div>
                    <div className="text-gray-500">{profile?.email || "No email"}</div>
                  </div>

                  {profile ? (
                    <Link
                      href={`/admin/teachers/${profile.id}`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      View teacher
                    </Link>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Students ({students.length})</div>

        <div className="divide-y">
          {students.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No student members found.
            </div>
          ) : (
            students.map((member) => {
              const profile = profileMap.get(member.user_id);

              return (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between gap-4 px-4 py-4 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {profile ? getPersonLabel(profile) : member.user_id}
                    </div>
                    <div className="text-gray-500">{profile?.email || "No email"}</div>
                  </div>

                  {profile ? (
                    <Link
                      href={`/admin/students/${profile.id}`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      View student
                    </Link>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
