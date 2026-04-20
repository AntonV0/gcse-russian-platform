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
    <>
      {success ? (
        <FeedbackBanner tone="success" description={success} className="mb-4" />
      ) : null}

      {error ? (
        <FeedbackBanner tone="danger" description={error} className="mb-4" />
      ) : null}
    </>
  );
}
