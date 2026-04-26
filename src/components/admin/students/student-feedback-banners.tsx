import FeedbackBanner from "@/components/ui/feedback-banner";

export default function StudentFeedbackBanners({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;

  return (
    <div className="mb-6 space-y-3">
      {success ? (
        <FeedbackBanner tone="success" title="Student account updated" description={success} />
      ) : null}

      {error ? (
        <FeedbackBanner tone="danger" title="Update failed" description={error} />
      ) : null}
    </div>
  );
}
