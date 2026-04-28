import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { FORM_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab/forms/ui-lab-forms-data";
import { UiLabFormsAdminControlSections } from "@/components/admin/ui-lab/forms/ui-lab-forms-admin-control-sections";
import { UiLabFormsFieldSections } from "@/components/admin/ui-lab/forms/ui-lab-forms-field-sections";
import { UiLabFormsGuidanceSections } from "@/components/admin/ui-lab/forms/ui-lab-forms-guidance-section";
import { UiLabFormsLayoutSections } from "@/components/admin/ui-lab/forms/ui-lab-forms-layout-sections";
import UiLabPageNav from "@/components/admin/ui-lab/shell/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab/shell/ui-lab-shell";

export default async function AdminUiFormsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Forms"
      description="Compare field styles, validation cues, grouped layouts, and patterns used across admin editing screens."
      currentPath="/admin/ui/forms"
    >
      <UiLabPageNav items={FORM_PAGE_NAV_ITEMS} />
      <UiLabFormsFieldSections />
      <UiLabFormsAdminControlSections />
      <UiLabFormsLayoutSections />
      <UiLabFormsGuidanceSections />
    </UiLabShell>
  );
}
