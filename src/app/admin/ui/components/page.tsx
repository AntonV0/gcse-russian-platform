import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { COMPONENTS_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-components-data";
import { UiLabComponentsBrandSections } from "@/components/admin/ui-lab-components-brand-sections";
import { UiLabComponentsFormReadinessSections } from "@/components/admin/ui-lab-components-form-readiness-sections";
import { UiLabComponentsListSections } from "@/components/admin/ui-lab-components-list-sections";
import { UiLabComponentsPanelSections } from "@/components/admin/ui-lab-components-panel-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";

export default async function AdminUiComponentsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Components"
      description="Preview the reusable building blocks that should shape admin and platform pages before applying one-off styling."
      currentPath="/admin/ui/components"
    >
      <UiLabPageNav items={COMPONENTS_PAGE_NAV_ITEMS} />
      <UiLabComponentsBrandSections />
      <UiLabComponentsPanelSections />
      <UiLabComponentsListSections />
      <UiLabComponentsFormReadinessSections />
    </UiLabShell>
  );
}
