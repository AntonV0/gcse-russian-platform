import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { TYPOGRAPHY_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-typography-data";
import { UiLabTypographyContentSections } from "@/components/admin/ui-lab-typography-content-sections";
import { UiLabTypographyHierarchySections } from "@/components/admin/ui-lab-typography-hierarchy-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";

export default async function AdminUiTypographyPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Typography"
      description="Reference page for hierarchy, body copy, labels, metadata, and readable text patterns across the platform."
      currentPath="/admin/ui/typography"
    >
      <UiLabPageNav items={TYPOGRAPHY_PAGE_NAV_ITEMS} />
      <UiLabTypographyHierarchySections />
      <UiLabTypographyContentSections />
    </UiLabShell>
  );
}
