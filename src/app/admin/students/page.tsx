import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  setTeacherRoleAction,
  switchStudentAccessGrantAction,
} from "@/app/actions/admin-user-actions";
import { appIcons } from "@/lib/shared/icons";

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
  isTeacher: boolean;
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

function getProductLabel(product: ProductRow) {
  const code = (product.code ?? "").toLowerCase();
  const name = (product.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (combined.includes("foundation") && combined.includes("full")) {
    return "Foundation Full";
  }

  if (combined.includes("higher") && combined.includes("full")) {
    return "Higher Full";
  }

  if (combined.includes("volna")) {
    return "Volna";
  }

  if (combined.includes("trial")) {
    return "Trial";
  }

  return product.name || product.code || product.id;
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

function SuccessErrorBanners({ success, error }: { success?: string; error?: string }) {
  return (
    <>
      {success ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </>
  );
}

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    access?: string;
    success?: string;
    error?: string;
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

  const currentPathWithFilters = `/admin/students?q=${encodeURIComponent(q)}&status=${encodeURIComponent(
    statusFilter
  )}&access=${encodeURIComponent(accessFilter)}`;

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
    supabase.from("products").select("id, code, name").order("name", { ascending: true }),
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
        isTeacher: profile.is_teacher,
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
      isTeacher: profile.is_teacher,
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

  const accessOptions = productRows.filter((product) => {
    const combined = `${product.code ?? ""} ${product.name ?? ""}`.toLowerCase();
    return (
      combined.includes("trial") ||
      combined.includes("foundation") ||
      combined.includes("higher") ||
      combined.includes("volna")
    );
  });

  return (
    <main>
      <PageHeader
        title="Students"
        description="Student accounts grouped by current access type."
      />

      <SuccessErrorBanners success={params.success} error={params.error} />

      <form className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <FormField label="Search">
            <Input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Name, email, or teaching group"
            />
          </FormField>

          <FormField label="Status">
            <Select name="status" defaultValue={statusFilter}>
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </Select>
          </FormField>

          <FormField label="Access">
            <Select name="access" defaultValue={accessFilter}>
              <option value="all">All</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="volna">Volna</option>
              <option value="trial">Trial</option>
              <option value="other">Other</option>
            </Select>
          </FormField>

          <div className="flex items-end gap-2">
            <Button type="submit" variant="primary" icon={appIcons.filter}>
              Apply
            </Button>

            <Button href="/admin/students" variant="secondary" icon={appIcons.back}>
              Reset
            </Button>
          </div>
        </div>
      </form>

      <div className="mb-6 rounded-xl border bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
        Total student accounts shown: {totalStudents}
      </div>

      <div className="space-y-6">
        {orderedGroups.length === 0 && filteredInactiveStudents.length === 0 ? (
          <div className="rounded-xl border bg-white px-4 py-6 text-sm text-gray-500 shadow-sm">
            No student accounts found.
          </div>
        ) : null}

        {orderedGroups.map((group) => (
          <div key={group.label} className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-4 py-3 font-medium">
              {group.label} ({group.rows.length})
            </div>

            <div className="divide-y">
              {group.rows.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <div>
                    <div className="font-medium">{getPersonLabel(student)}</div>

                    <div className="text-sm text-gray-500">
                      {student.email || "No email"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Badge tone="info" icon={appIcons.user}>
                        {student.accessLabel}
                      </Badge>

                      <Badge tone="success" icon={appIcons.completed}>
                        Active
                      </Badge>

                      {student.groupNames.map((groupName) => (
                        <Badge key={groupName} tone="muted" icon={appIcons.users}>
                          {groupName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 text-xs">
                    <div className="text-right text-gray-400">
                      <div>Start: {formatDate(student.startsAt)}</div>
                      <div>End: {formatDate(student.endsAt)}</div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <form
                        action={switchStudentAccessGrantAction}
                        className="flex gap-2"
                      >
                        <input type="hidden" name="userId" value={student.id} />
                        <input
                          type="hidden"
                          name="redirectTo"
                          value={currentPathWithFilters}
                        />
                        <Select
                          name="productId"
                          defaultValue=""
                          className="w-auto min-w-[140px] px-2 py-1 text-xs"
                        >
                          <option value="">Switch access</option>
                          {accessOptions.map((product) => (
                            <option key={product.id} value={product.id}>
                              {getProductLabel(product)}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" variant="secondary" size="sm">
                          Apply
                        </Button>
                      </form>

                      <form action={setTeacherRoleAction}>
                        <input type="hidden" name="userId" value={student.id} />
                        <input
                          type="hidden"
                          name="redirectTo"
                          value={currentPathWithFilters}
                        />
                        <input type="hidden" name="mode" value="enable" />
                        <Button type="submit" variant="secondary" size="sm">
                          Make teacher
                        </Button>
                      </form>

                      <Button
                        href={`/admin/students/${student.id}`}
                        variant="secondary"
                        size="sm"
                        icon={appIcons.preview}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-xl border bg-white shadow-sm">
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
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <div>
                    <div className="font-medium">{getPersonLabel(student)}</div>

                    <div className="text-sm text-gray-500">
                      {student.email || "No email"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <Badge tone="muted" icon={appIcons.user}>
                        {student.accessLabel}
                      </Badge>

                      <Badge tone="warning" icon={appIcons.pending}>
                        Inactive
                      </Badge>

                      {student.groupNames.map((groupName) => (
                        <Badge key={groupName} tone="muted" icon={appIcons.users}>
                          {groupName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 text-xs">
                    <div className="text-right text-gray-400">
                      <div>Start: {formatDate(student.startsAt)}</div>
                      <div>End: {formatDate(student.endsAt)}</div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <form
                        action={switchStudentAccessGrantAction}
                        className="flex gap-2"
                      >
                        <input type="hidden" name="userId" value={student.id} />
                        <input
                          type="hidden"
                          name="redirectTo"
                          value={currentPathWithFilters}
                        />
                        <Select
                          name="productId"
                          defaultValue=""
                          className="w-auto min-w-[140px] px-2 py-1 text-xs"
                        >
                          <option value="">Switch access</option>
                          {accessOptions.map((product) => (
                            <option key={product.id} value={product.id}>
                              {getProductLabel(product)}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" variant="secondary" size="sm">
                          Apply
                        </Button>
                      </form>

                      <form action={setTeacherRoleAction}>
                        <input type="hidden" name="userId" value={student.id} />
                        <input
                          type="hidden"
                          name="redirectTo"
                          value={currentPathWithFilters}
                        />
                        <input type="hidden" name="mode" value="enable" />
                        <Button type="submit" variant="secondary" size="sm">
                          Make teacher
                        </Button>
                      </form>

                      <Button
                        href={`/admin/students/${student.id}`}
                        variant="secondary"
                        size="sm"
                        icon={appIcons.preview}
                      >
                        View
                      </Button>
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
