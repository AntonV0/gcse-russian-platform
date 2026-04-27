import type { ButtonVariant } from "@/components/ui/button-styles";
import type { AppIconKey } from "@/lib/shared/icons";

export const BUTTONS_PAGE_NAV_ITEMS = [
  { id: "dev-markers", label: "Dev markers" },
  { id: "core-hierarchy", label: "Core hierarchy" },
  { id: "variant-matrix", label: "Variants" },
  { id: "states", label: "States" },
  { id: "exit-loading", label: "Exit + loading" },
  { id: "dense-patterns", label: "Dense patterns" },
  { id: "project-examples", label: "Project examples" },
  { id: "future-components", label: "Future" },
];

export const buttonVariantMatrix: Array<{
  variant: ButtonVariant;
  label: string;
  role: string;
  icon: AppIconKey;
}> = [
  {
    variant: "primary",
    label: "Primary",
    role: "Main page or section action",
    icon: "completed",
  },
  {
    variant: "accent",
    label: "Accent",
    role: "Promotional or high-energy learning CTA",
    icon: "create",
  },
  {
    variant: "secondary",
    label: "Secondary",
    role: "Default safe action",
    icon: "preview",
  },
  {
    variant: "soft",
    label: "Soft",
    role: "Calm student progression action",
    icon: "next",
  },
  {
    variant: "quiet",
    label: "Quiet",
    role: "Low-emphasis utility action",
    icon: "edit",
  },
  {
    variant: "inverse",
    label: "Inverse",
    role: "Strong contrast or admin highlight",
    icon: "dashboard",
  },
  {
    variant: "success",
    label: "Success",
    role: "Positive status action",
    icon: "completed",
  },
  {
    variant: "warning",
    label: "Warning",
    role: "Caution or pending action",
    icon: "pending",
  },
  {
    variant: "danger",
    label: "Danger",
    role: "Destructive confirmation",
    icon: "delete",
  },
  {
    variant: "exit",
    label: "Exit",
    role: "Logout or leave-account flow",
    icon: "userX",
  },
];
