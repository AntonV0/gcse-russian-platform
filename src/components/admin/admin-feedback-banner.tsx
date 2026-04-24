"use client";

import FeedbackBanner from "@/components/ui/feedback-banner";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type AdminFeedbackBannerProps = {
  success?: string;
  error?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function AdminFeedbackBanner({
  success,
  error,
}: AdminFeedbackBannerProps) {
  if (!success && !error) {
    return null;
  }

  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AdminFeedbackBanner"
          filePath="src/components/admin/admin-feedback-banner.tsx"
          tier="semantic"
          componentRole="Admin form/action feedback wrapper"
          bestFor="Admin success/error messages after mutations, saves, publishes, archive actions, and form submissions."
          usageExamples={[
            "Course saved message",
            "Lesson publish error",
            "Assignment update success",
            "Archive action feedback",
          ]}
          notes="Use for admin mutation feedback. Use FeedbackBanner directly for custom page-level guidance or non-admin contexts."
        />
      ) : null}

      <div className="space-y-3">
        {success ? <FeedbackBanner tone="success" description={success} /> : null}
        {error ? <FeedbackBanner tone="danger" description={error} /> : null}
      </div>
    </div>
  );
}
