import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { FEEDBACK_PAGE_NAV_ITEMS } from "@/components/admin/ui-lab/feedback/ui-lab-feedback-data";
import { UiLabFeedbackBadgeSections } from "@/components/admin/ui-lab/feedback/ui-lab-feedback-badge-sections";
import { UiLabFeedbackBannerQuestionSections } from "@/components/admin/ui-lab/feedback/ui-lab-feedback-banner-question-sections";
import { UiLabFeedbackEmptyGuidanceSections } from "@/components/admin/ui-lab/feedback/ui-lab-feedback-empty-guidance-sections";
import UiLabPageNav from "@/components/admin/ui-lab/shell/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab/shell/ui-lab-shell";

export default async function AdminUiFeedbackPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Feedback"
      description="Compare badges, banners, alerts, empty states, and status messaging patterns used across the platform."
      currentPath="/admin/ui/feedback"
    >
      <UiLabPageNav items={FEEDBACK_PAGE_NAV_ITEMS} />
      <UiLabFeedbackBadgeSections />
      <UiLabFeedbackBannerQuestionSections />
      <UiLabFeedbackEmptyGuidanceSections />
    </UiLabShell>
  );
}
