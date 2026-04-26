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

export type ProductRow = {
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

export type StudentCard = {
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

export type StudentGroup = {
  label: string;
  rows: StudentCard[];
};

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

function getAccessOptions(productRows: ProductRow[]) {
  return productRows.filter((product) => {
    const combined = `${product.code ?? ""} ${product.name ?? ""}`.toLowerCase();
    return (
      combined.includes("trial") ||
      combined.includes("foundation") ||
      combined.includes("higher") ||
      combined.includes("volna")
    );
  });
}

export async function getAdminStudentList(params: {
  q: string;
  statusFilter: string;
  accessFilter: string;
}) {
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
  const groupedStudents = new Map<string, StudentGroup>();
  const inactiveStudents: StudentCard[] = [];
  const grantsByUserId = new Map<string, AccessGrantRow[]>();

  for (const grant of grantRows) {
    if (!grantsByUserId.has(grant.user_id)) {
      grantsByUserId.set(grant.user_id, []);
    }
    grantsByUserId.get(grant.user_id)!.push(grant);
  }

  for (const profile of profileRows) {
    if (profile.is_admin || profile.is_teacher || teacherIds.has(profile.id)) continue;

    const userGrants = grantsByUserId.get(profile.id) ?? [];
    const activeGrant = userGrants.find((grant) => grant.is_active) ?? null;
    const groupNames = studentGroupsByUserId.get(profile.id) ?? [];

    if (activeGrant) {
      const product = activeGrant.product_id
        ? (productMap.get(activeGrant.product_id) ?? null)
        : null;
      const bucket = getStudentBucket(
        activeGrant.access_mode,
        product?.code ?? null,
        product?.name ?? null
      );

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
    .filter((group): group is StudentGroup => Boolean(group))
    .map((group) => ({
      label: group.label,
      rows: group.rows.filter((student) => {
        if (!matchesSearch(student, params.q)) return false;
        if (params.statusFilter === "active" && !student.isActive) return false;
        if (params.statusFilter === "inactive" && student.isActive) return false;
        if (params.accessFilter !== "all" && student.accessKey !== params.accessFilter) {
          return false;
        }
        return true;
      }),
    }))
    .filter((group) => group.rows.length > 0);

  const filteredInactiveStudents = inactiveStudents.filter((student) => {
    if (!matchesSearch(student, params.q)) return false;
    if (params.statusFilter === "active") return false;
    if (params.accessFilter !== "all" && student.accessKey !== params.accessFilter) {
      return false;
    }
    return true;
  });

  return {
    orderedGroups,
    filteredInactiveStudents,
    totalStudents:
      orderedGroups.reduce((sum, group) => sum + group.rows.length, 0) +
      filteredInactiveStudents.length,
    accessOptions: getAccessOptions(productRows),
  };
}
