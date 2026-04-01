import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
};

type AccessGrantRow = {
  id: string;
  user_id: string;
  access_mode: string;
  is_active: boolean;
  product_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  products: Array<{
    code: string | null;
    name: string | null;
  }>;
};

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

function formatDateTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPersonLabel(profile: ProfileRow) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminStudentProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { userId } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: grants }, { data: memberships }, { data: groups }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, display_name, is_admin, created_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_access_grants")
        .select(
          `
          id,
          user_id,
          access_mode,
          is_active,
          product_id,
          starts_at,
          ends_at,
          products (
            code,
            name
          )
        `
        )
        .eq("user_id", userId)
        .order("starts_at", { ascending: false }),
      supabase
        .from("teaching_group_members")
        .select("user_id, group_id, member_role")
        .eq("user_id", userId),
      supabase
        .from("teaching_groups")
        .select("id, name, course_id, course_variant_id, is_active"),
    ]);

  const student = profile as ProfileRow | null;
  const accessGrants = (grants ?? []) as unknown as AccessGrantRow[];
  const studentMemberships = (memberships ?? []) as TeachingGroupMemberRow[];
  const teachingGroups = (groups ?? []) as TeachingGroupRow[];

  if (!student) {
    return <main>Student not found.</main>;
  }

  const groupMap = new Map(teachingGroups.map((group) => [group.id, group]));
  const membershipsWithGroup = studentMemberships.map((membership) => ({
    ...membership,
    group: groupMap.get(membership.group_id) ?? null,
  }));

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/students" className="text-sm text-blue-600 hover:underline">
          ← Back to students
        </Link>
      </div>

      <PageHeader
        title={getPersonLabel(student)}
        description="Student profile, access grants, and teaching group memberships."
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Profile Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Full name:</span> {student.full_name || "—"}
            </div>
            <div>
              <span className="font-medium">Display name:</span>{" "}
              {student.display_name || "—"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {student.email || "—"}
            </div>
            <div>
              <span className="font-medium">Admin:</span>{" "}
              {student.is_admin ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(student.created_at)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="space-y-3 px-4 py-4 text-sm text-gray-600">
            <p>Student editing tools can be added here next.</p>
            <p>Good future actions:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>edit access grants</li>
              <li>assign to teaching group</li>
              <li>view assignments</li>
              <li>view progress</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Access Grants ({accessGrants.length})
        </div>

        <div className="divide-y">
          {accessGrants.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">No access grants found.</div>
          ) : (
            accessGrants.map((grant) => {
              const product = grant.products?.[0] ?? null;

              return (
                <div key={grant.id} className="px-4 py-4 text-sm">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded border px-2 py-0.5">
                      {grant.access_mode}
                    </span>
                    <span className="rounded border px-2 py-0.5">
                      {grant.is_active ? "Active" : "Inactive"}
                    </span>
                    {product?.name ? (
                      <span className="rounded border px-2 py-0.5">{product.name}</span>
                    ) : null}
                    {product?.code ? (
                      <span className="rounded border px-2 py-0.5">{product.code}</span>
                    ) : null}
                  </div>

                  <div className="text-gray-600">
                    <div>Start: {formatDateTime(grant.starts_at)}</div>
                    <div>End: {formatDateTime(grant.ends_at)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Teaching Group Memberships ({membershipsWithGroup.length})
        </div>

        <div className="divide-y">
          {membershipsWithGroup.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teaching group memberships found.
            </div>
          ) : (
            membershipsWithGroup.map((membership) => (
              <div
                key={`${membership.group_id}-${membership.member_role}`}
                className="px-4 py-4 text-sm"
              >
                <div className="font-medium">
                  {membership.group?.name || membership.group_id}
                </div>
                <div className="text-gray-600">Role: {membership.member_role}</div>
                <div className="text-gray-600">
                  Group active: {membership.group?.is_active ? "Yes" : "No"}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
