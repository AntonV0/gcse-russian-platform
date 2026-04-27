import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabLessonBuilderSections, {
  LESSON_BUILDER_PAGE_NAV_ITEMS,
} from "@/components/admin/ui-lab-lesson-builder-sections";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

export default async function AdminUiLessonBuilderPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Lesson Builder"
      description="Reference patterns for the CMS authoring workspace: sections, block creation, draggable lists, inspectors, metadata, and save states."
      currentPath="/admin/ui/lesson-builder"
    >
      <UiLabPageNav items={LESSON_BUILDER_PAGE_NAV_ITEMS} />
      <UiLabLessonBuilderSections />
    </UiLabShell>
  );
}
