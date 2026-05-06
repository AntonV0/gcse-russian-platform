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

export function getStudyRouteLabel(
  variant: DashboardInfo["variant"],
  accessMode: DashboardInfo["accessMode"]
) {
  if (accessMode === "volna") return "Volna student route";
  if (variant === "foundation") return "Foundation self-study";
  if (variant === "higher") return "Higher self-study";
  return "No course selected yet";
}

export function getAccountSummaryText(
  variant: DashboardInfo["variant"],
  accessMode: DashboardInfo["accessMode"]
) {
  if (accessMode === "volna") {
    return "Your account is connected to the Volna learning route, with lessons, assignments, and teacher-linked study in one place.";
  }

  if (variant === "foundation") {
    return "You are set up for Foundation, with the course plan and account tools close by whenever you need them.";
  }

  if (variant === "higher") {
    return "You are set up for Higher, with your course plan and account tools close by whenever you need them.";
  }

  return "Your account is ready. You can update your profile, adjust settings, and choose a GCSE Russian course plan when you are ready.";
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB");
}
