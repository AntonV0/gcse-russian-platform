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

type TeachingGroupMemberRow = {
  user_id: string;
  member_role: string;
};

type StudentCard = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  accessLabel: string;
  accessMode: string;
  productCode: string | null;
  productName: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

function getPersonLabel(
  profile: Pick<ProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStudentBucket(grant: AccessGrantRow) {
  const product = grant.products?.[0] ?? null;
  const code = product?.code ?? "";
  const name = product?.name ?? "";
  const combined = `${code} ${name}`.toLowerCase();

  if (grant.access_mode === "trial") {
    return {
      key: "trial",
      label: "Trial Students",
      accessLabel: "Trial",
    };
  }

  if (grant.access_mode === "volna") {
    return {
      key: "volna",
      label: "Volna Students",
      accessLabel: "Volna",
    };
  }

  if (grant.access_mode === "full" && combined.includes("foundation")) {
    return {
      key: "foundation",
      label: "Foundation Students",
      accessLabel: "Foundation Full",
    };
  }

  if (grant.access_mode === "full" && combined.includes("higher")) {
    return {
      key: "higher",
      label: "Higher Students",
      accessLabel: "Higher Full",
    };
  }

  return {
    key: "other",
    label: "Other Students",
    accessLabel: grant.access_mode || "Unknown",
  };
}

export default async function AdminStudentsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [{ data: profiles }, { data: grants }, { data: memberships }] = await Promise.all(
    [
      supabase
        .from("profiles")
        .select("id, email, full_name, display_name, is_admin, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("user_access_grants")
        .select(
          `
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
        .eq("is_active", true),
      supabase.from("teaching_group_members").select("user_id, member_role"),
    ]
  );

  const profileRows = (profiles ?? []) as ProfileRow[];
  const grantRows = (grants ?? []) as unknown as AccessGrantRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];

  const teacherIds = new Set(
    membershipRows
      .filter((member) => member.member_role === "teacher")
      .map((member) => member.user_id)
  );

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile]));

  const groupedStudents = new Map<string, { label: string; rows: StudentCard[] }>();

  for (const grant of grantRows) {
    const profile = profileMap.get(grant.user_id);

    if (!profile) continue;
    if (profile.is_admin) continue;
    if (teacherIds.has(profile.id)) continue;

    const bucket = getStudentBucket(grant);
    const product = grant.products?.[0] ?? null;

    if (!groupedStudents.has(bucket.key)) {
      groupedStudents.set(bucket.key, {
        label: bucket.label,
        rows: [],
      });
    }

    groupedStudents.get(bucket.key)?.rows.push({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      display_name: profile.display_name,
      accessLabel: bucket.accessLabel,
      accessMode: grant.access_mode,
      productCode: product?.code ?? null,
      productName: product?.name ?? null,
      startsAt: grant.starts_at,
      endsAt: grant.ends_at,
    });
  }

  const orderedGroups = ["foundation", "higher", "volna", "trial", "other"]
    .map((key) => groupedStudents.get(key))
    .filter(Boolean) as Array<{ label: string; rows: StudentCard[] }>;

  const totalStudents = orderedGroups.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <main>
      <PageHeader
        title="Students"
        description="Student accounts grouped by current access type."
      />

      <div className="space-y-6">
        {orderedGroups.length === 0 ? (
          <div className="rounded-lg border bg-white px-4 py-6 text-sm text-gray-500">
            No student accounts found.
          </div>
        ) : (
          orderedGroups.map((group) => (
            <div key={group.label} className="rounded-lg border bg-white">
              <div className="border-b px-4 py-3 font-medium">
                {group.label} ({group.rows.length})
              </div>

              <div className="divide-y">
                {group.rows.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div>
                      <div className="font-medium">{getPersonLabel(student)}</div>

                      <div className="text-sm text-gray-500">
                        {student.email || "No email"}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <span className="rounded border px-2 py-0.5">
                          {student.accessLabel}
                        </span>

                        {student.productName ? (
                          <span className="rounded border px-2 py-0.5">
                            {student.productName}
                          </span>
                        ) : null}

                        {student.productCode ? (
                          <span className="rounded border px-2 py-0.5">
                            {student.productCode}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-400">
                      <div>Start: {formatDate(student.startsAt)}</div>
                      <div>End: {formatDate(student.endsAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-600">
          Total student accounts shown: {totalStudents}
        </div>
      </div>
    </main>
  );
}
