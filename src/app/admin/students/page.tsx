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
};

type ProductRow = {
  id: string;
  code: string | null;
  name: string | null;
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
  isActive: boolean;
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

function getStudentBucket(
  accessMode: string,
  productCode: string | null,
  productName: string | null
) {
  const code = (productCode ?? "").toLowerCase();
  const name = (productName ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (accessMode === "volna") {
    return {
      key: "volna",
      label: "Volna School Students",
      accessLabel: "Volna",
    };
  }

  if (accessMode === "trial") {
    return {
      key: "trial",
      label: "Trial Students",
      accessLabel: "Trial",
    };
  }

  if (accessMode === "full" && combined.includes("foundation")) {
    return {
      key: "foundation",
      label: "Foundation Students",
      accessLabel: "Foundation Full",
    };
  }

  if (accessMode === "full" && combined.includes("higher")) {
    return {
      key: "higher",
      label: "Higher Students",
      accessLabel: "Higher Full",
    };
  }

  return {
    key: "other",
    label: "Other Students",
    accessLabel: accessMode || "Unknown",
  };
}

function getGrantLabel(
  accessMode: string,
  productCode: string | null,
  productName: string | null
) {
  return getStudentBucket(accessMode, productCode, productName).accessLabel;
}

export default async function AdminStudentsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [
    { data: profiles },
    { data: grants },
    { data: memberships },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, display_name, is_admin, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("user_access_grants")
      .select("id, user_id, access_mode, is_active, product_id, starts_at, ends_at")
      .order("starts_at", { ascending: false }),
    supabase.from("teaching_group_members").select("user_id, member_role"),
    supabase.from("products").select("id, code, name"),
  ]);

  const profileRows = (profiles ?? []) as ProfileRow[];
  const grantRows = (grants ?? []) as AccessGrantRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];
  const productRows = (products ?? []) as ProductRow[];

  const teacherIds = new Set(
    membershipRows
      .filter((member) => member.member_role === "teacher")
      .map((member) => member.user_id)
  );

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile]));
  const productMap = new Map(productRows.map((product) => [product.id, product]));

  const groupedStudents = new Map<string, { label: string; rows: StudentCard[] }>();
  const inactiveStudents: StudentCard[] = [];

  const grantsByUserId = new Map<string, AccessGrantRow[]>();

  for (const grant of grantRows) {
    if (!grantsByUserId.has(grant.user_id)) {
      grantsByUserId.set(grant.user_id, []);
    }
    grantsByUserId.get(grant.user_id)!.push(grant);
  }

  for (const profile of profileRows) {
    if (profile.is_admin) continue;
    if (teacherIds.has(profile.id)) continue;

    const userGrants = grantsByUserId.get(profile.id) ?? [];
    const activeGrant = userGrants.find((grant) => grant.is_active) ?? null;

    if (activeGrant) {
      const product = activeGrant.product_id
        ? (productMap.get(activeGrant.product_id) ?? null)
        : null;

      const productCode = product?.code ?? null;
      const productName = product?.name ?? null;

      const bucket = getStudentBucket(activeGrant.access_mode, productCode, productName);

      if (!groupedStudents.has(bucket.key)) {
        groupedStudents.set(bucket.key, { label: bucket.label, rows: [] });
      }

      groupedStudents.get(bucket.key)?.rows.push({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        display_name: profile.display_name,
        accessLabel: bucket.accessLabel,
        isActive: true,
        startsAt: activeGrant.starts_at,
        endsAt: activeGrant.ends_at,
      });

      continue;
    }

    const latestGrant = userGrants[0] ?? null;
    const latestProduct = latestGrant?.product_id
      ? (productMap.get(latestGrant.product_id) ?? null)
      : null;

    const latestLabel = latestGrant
      ? getGrantLabel(
          latestGrant.access_mode,
          latestProduct?.code ?? null,
          latestProduct?.name ?? null
        )
      : "No Active Access";

    inactiveStudents.push({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      display_name: profile.display_name,
      accessLabel: latestLabel,
      isActive: false,
      startsAt: latestGrant?.starts_at ?? null,
      endsAt: latestGrant?.ends_at ?? null,
    });
  }

  const orderedGroups = ["foundation", "higher", "volna", "trial", "other"]
    .map((key) => groupedStudents.get(key))
    .filter(Boolean) as Array<{ label: string; rows: StudentCard[] }>;

  const totalStudents =
    orderedGroups.reduce((sum, group) => sum + group.rows.length, 0) +
    inactiveStudents.length;

  return (
    <main>
      <PageHeader
        title="Students"
        description="Student accounts grouped by current access type."
      />

      <div className="mb-6 rounded-lg border bg-white px-4 py-3 text-sm text-gray-600">
        Total student accounts shown: {totalStudents}
      </div>

      <div className="space-y-6">
        {orderedGroups.length === 0 && inactiveStudents.length === 0 ? (
          <div className="rounded-lg border bg-white px-4 py-6 text-sm text-gray-500">
            No student accounts found.
          </div>
        ) : null}

        {orderedGroups.map((group) => (
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

                      <span className="rounded border px-2 py-0.5">Active</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-xs">
                    <div className="text-gray-400">
                      <div>Start: {formatDate(student.startsAt)}</div>
                      <div>End: {formatDate(student.endsAt)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="rounded border px-2 py-1 hover:bg-gray-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">
            Inactive / No Active Access ({inactiveStudents.length})
          </div>

          <div className="divide-y">
            {inactiveStudents.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No inactive students found.
              </div>
            ) : (
              inactiveStudents.map((student) => (
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

                      <span className="rounded border px-2 py-0.5">Inactive</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-xs">
                    <div className="text-gray-400">
                      <div>Start: {formatDate(student.startsAt)}</div>
                      <div>End: {formatDate(student.endsAt)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="rounded border px-2 py-1 hover:bg-gray-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
