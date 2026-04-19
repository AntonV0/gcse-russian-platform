import AppIcon from "@/components/ui/app-icon";

type AdminFeedbackBannerProps = {
  success?: string;
  error?: string;
};

function FeedbackMessage({
  tone,
  icon,
  children,
}: {
  tone: "success" | "danger";
  icon: React.ComponentProps<typeof AppIcon>["icon"];
  children: React.ReactNode;
}) {
  const toneClasses =
    tone === "success"
      ? "border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success-strong)]"
      : "border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger-strong)]";

  return (
    <div
      className={[
        "mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm",
        toneClasses,
      ].join(" ")}
    >
      <span className="mt-0.5 shrink-0">
        <AppIcon icon={icon} size={16} />
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function AdminFeedbackBanner({
  success,
  error,
}: AdminFeedbackBannerProps) {
  if (!success && !error) return null;

  return (
    <>
      {success ? (
        <FeedbackMessage tone="success" icon="completed">
          {success}
        </FeedbackMessage>
      ) : null}

      {error ? (
        <FeedbackMessage tone="danger" icon="warning">
          {error}
        </FeedbackMessage>
      ) : null}
    </>
  );
}
