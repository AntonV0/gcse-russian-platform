import type {
  AdminAccessGrantRow,
  AdminProductRow,
  AdminProfileRow,
  AdminTeachingGroupMemberRow,
  AdminTeachingGroupRow,
} from "@/lib/users/admin-user-helpers-db";

export type StudentMembershipWithGroup = AdminTeachingGroupMemberRow & {
  group: AdminTeachingGroupRow | null;
};

export function formatDateTime(value: string | null) {
  if (!value) return "-";

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

export function getPersonLabel(profile: AdminProfileRow) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export function getGrantLabel(grant: AdminAccessGrantRow) {
  const product = grant.products?.[0] ?? null;
  const code = (product?.code ?? "").toLowerCase();
  const name = (product?.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (grant.access_mode === "volna") return "Volna";
  if (grant.access_mode === "trial") return "Trial";
  if (grant.access_mode === "full" && combined.includes("foundation")) {
    return "Foundation Full";
  }
  if (grant.access_mode === "full" && combined.includes("higher")) {
    return "Higher Full";
  }

  return grant.access_mode;
}

export function getProductLabel(product: AdminProductRow) {
  const code = (product.code ?? "").toLowerCase();
  const name = (product.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (combined.includes("foundation") && combined.includes("full")) {
    return "Foundation Full";
  }

  if (combined.includes("higher") && combined.includes("full")) {
    return "Higher Full";
  }

  if (combined.includes("volna")) return "Volna";
  if (combined.includes("trial")) return "Trial";

  return product.name || product.code || product.id;
}

export function formatVariantLabel(variantSlug: string) {
  return variantSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
