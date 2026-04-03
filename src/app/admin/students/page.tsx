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
  is_teacher: boolean;
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
  group_id: string;
};

type TeachingGroupRow = {
  id: string;
  name: string;
};

type StudentCard = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  accessLabel: string;
  accessKey: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  groupNames: string[];
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

function matchesSearch(student: StudentCard, search: string) {
  if (!search) return true;

  const haystack = [
    student.full_name ?? "",
    student.display_name ?? "",
    student.email ?? "",
    ...student.groupNames,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(search.toLowerCase());
}

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    access?: string;
  }>;
}) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const q = (params.q ?? "").trim();
  const statusFilter = (params.status ?? "all").trim();
  const accessFilter = (params.access ?? "all").trim();

  const supabase = await createClient();

  const [
    { data: profiles },
    { data: grants },
    { data: memberships },
    { data: products },
    { data: groups },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, display_name, is_admin, is_teacher, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("user_access_grants")
      .select("id, user_id, access_mode, is_active, product_id, starts_at, ends_at")
      .order("starts_at", { ascending: false }),
    supabase.from("teaching_group_members").select("user_id, member_role, group_id"),
    supabase.from("products").select("id, code, name"),
    supabase.from("teaching_groups").select("id, name"),
  ]);

  const profileRows = (profiles ?? []) as ProfileRow[];
  const grantRows = (grants ?? []) as AccessGrantRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];
  const productRows = (products ?? []) as ProductRow[];
  const groupRows = (groups ?? []) as TeachingGroupRow[];

  const teacherIds = new Set(
    membershipRows
      .filter((member) => member.member_role === "teacher")
      .map((member) => member.user_id)
  );

  const groupMap = new Map(groupRows.map((group) => [group.id, group.name]));
  const studentGroupsByUserId = new Map<string, string[]>();

  for (const membership of membershipRows) {
    if (membership.member_role !== "student") continue;
    if (!studentGroupsByUserId.has(membership.user_id)) {
      studentGroupsByUserId.set(membership.user_id, []);
    }

    const groupName = groupMap.get(membership.group_id);
    if (groupName) {
      studentGroupsByUserId.get(membership.user_id)!.push(groupName);
    }
  }

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
    if (profile.is_teacher) continue;
    if (teacherIds.has(profile.id)) continue;

    const userGrants = grantsByUserId.get(profile.id) ?? [];
    const activeGrant = userGrants.find((grant) => grant.is_active) ?? null;
    const groupNames = studentGroupsByUserId.get(profile.id) ?? [];

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
        accessKey: bucket.key,
        isActive: true,
        startsAt: activeGrant.starts_at,
        endsAt: activeGrant.ends_at,
        groupNames,
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

    const latestKey = latestGrant
      ? getStudentBucket(
          latestGrant.access_mode,
          latestProduct?.code ?? null,
          latestProduct?.name ?? null
        ).key
      : "none";

    inactiveStudents.push({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      display_name: profile.display_name,
      accessLabel: latestLabel,
      accessKey: latestKey,
      isActive: false,
      startsAt: latestGrant?.starts_at ?? null,
      endsAt: latestGrant?.ends_at ?? null,
      groupNames,
    });
  }

  const orderedGroups = ["foundation", "higher", "volna", "trial", "other"]
    .map((key) => groupedStudents.get(key))
    .filter(Boolean)
    .map((group) => ({
      label: group!.label,
      rows: group!.rows.filter((student) => {
        if (!matchesSearch(student, q)) return false;
        if (statusFilter === "active" && !student.isActive) return false;
        if (statusFilter === "inactive" && student.isActive) return false;
        if (accessFilter !== "all" && student.accessKey !== accessFilter) return false;
        return true;
      }),
    }))
    .filter((group) => group.rows.length > 0);

  const filteredInactiveStudents = inactiveStudents.filter((student) => {
    if (!matchesSearch(student, q)) return false;
    if (statusFilter === "active") return false;
    if (accessFilter !== "all" && student.accessKey !== accessFilter) return false;
    return true;
  });

  const totalStudents =
    orderedGroups.reduce((sum, group) => sum + group.rows.length, 0) +
    filteredInactiveStudents.length;

  return (
    <main>
      <PageHeader
        title="Students"
        description="Student accounts grouped by current access type."
      />

      <form className="mb-6 rounded-lg border bg-white p-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <div>
            <label className="mb-1 block text-sm font-medium">Search</label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Name, email, or teaching group"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={statusFilter}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Access</label>
            <select
              name="access"
              defaultValue={accessFilter}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="volna">Volna</option>
              <option value="trial">Trial</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-sm text-white"
            >
              Apply
            </button>

            <Link
              href="/admin/students"
              className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="mb-6 rounded-lg border bg-white px-4 py-3 text-sm text-gray-600">
        Total student accounts shown: {totalStudents}
      </div>

      <div className="space-y-6">
        {orderedGroups.length === 0 && filteredInactiveStudents.length === 0 ? (
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

                      {student.groupNames.map((groupName) => (
                        <span key={groupName} className="rounded border px-2 py-0.5">
                          {groupName}
                        </span>
                      ))}
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
            Inactive / No Active Access ({filteredInactiveStudents.length})
          </div>

          <div className="divide-y">
            {filteredInactiveStudents.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500">
                No inactive students found.
              </div>
            ) : (
              filteredInactiveStudents.map((student) => (
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

                      {student.groupNames.map((groupName) => (
                        <span key={groupName} className="rounded border px-2 py-0.5">
                          {groupName}
                        </span>
                      ))}
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
