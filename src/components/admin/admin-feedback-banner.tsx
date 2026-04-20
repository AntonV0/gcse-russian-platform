import FeedbackBanner from "@/components/ui/feedback-banner";

type AdminFeedbackBannerProps = {
  success?: string;
  error?: string;
};

export default function AdminFeedbackBanner({
  success,
  error,
}: AdminFeedbackBannerProps) {
  if (!success && !error) {
    return null;
  }

  return (
    <div className="space-y-3">
      {success ? <FeedbackBanner tone="success" description={success} /> : null}
      {error ? <FeedbackBanner tone="danger" description={error} /> : null}
    </div>
  );
}
