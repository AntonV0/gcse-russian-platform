type AdminFeedbackBannerProps = {
  success?: string;
  error?: string;
};

export default function AdminFeedbackBanner({
  success,
  error,
}: AdminFeedbackBannerProps) {
  if (!success && !error) return null;

  return (
    <>
      {success ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}
    </>
  );
}
