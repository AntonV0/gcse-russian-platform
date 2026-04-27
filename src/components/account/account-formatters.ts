import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

export function formatRoleLabel(role: string | null | undefined) {
  if (!role) return "No role found";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function formatAccessLabel(accessMode: string | null | undefined) {
  if (!accessMode) return "No access found";
  if (accessMode === "full") return "Full access";
  if (accessMode === "trial") return "Trial access";
  if (accessMode === "volna") return "Volna access";
  return accessMode;
}

export function getVariantLabel(variant: DashboardInfo["variant"]) {
  if (!variant) return "No active variant";
  if (variant === "foundation") return "Foundation";
  if (variant === "higher") return "Higher";
  return "Volna";
}

export function getAccountSummaryText(
  variant: DashboardInfo["variant"],
  accessMode: DashboardInfo["accessMode"]
) {
  if (accessMode === "volna") {
    return "Your account is set up for the Volna student experience, including teacher-linked learning and assignments.";
  }

  if (variant === "foundation") {
    return "Your account is currently focused on the Foundation learning path.";
  }

  if (variant === "higher") {
    return "Your account is currently focused on the Higher learning path.";
  }

  return "Your account is ready, and more personalisation and learning tools can be managed from here.";
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB");
}
