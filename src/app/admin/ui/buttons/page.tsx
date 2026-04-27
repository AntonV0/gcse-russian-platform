import { BUTTONS_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-buttons-data";
import UiLabButtonsFoundationSections from "@/components/admin/ui-lab-buttons-foundation-sections";
import UiLabButtonsPatternSections from "@/components/admin/ui-lab-buttons-pattern-sections";
import UiLabButtonsStateSections from "@/components/admin/ui-lab-buttons-state-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminUiButtonsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Buttons"
      description="Reference for button variants, icon patterns, interaction states, and shared component inspection in development."
      currentPath="/admin/ui/buttons"
    >
      <UiLabPageNav items={BUTTONS_PAGE_NAV_ITEMS} />
      <UiLabButtonsFoundationSections />
      <UiLabButtonsStateSections />
      <UiLabButtonsPatternSections />
    </UiLabShell>
  );
}
