import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { LESSON_CONTENT_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab-lesson-content-data";
import { UiLabLessonContentPracticeSections } from "@/components/admin/ui-lab-lesson-content-practice-sections";
import { UiLabLessonContentSurfaceSections } from "@/components/admin/ui-lab-lesson-content-surface-sections";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";

export default async function AdminUiLessonContentPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Lesson Content"
      description="Reference patterns for student-facing lesson surfaces, content blocks, practice wrappers, locked states, and progression guidance."
      currentPath="/admin/ui/lesson-content"
    >
      <UiLabPageNav items={LESSON_CONTENT_PAGE_NAV_ITEMS} />
      <UiLabLessonContentSurfaceSections />
      <UiLabLessonContentPracticeSections />
    </UiLabShell>
  );
}
