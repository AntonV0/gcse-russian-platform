import Button from "@/components/ui/button";
import type { ProfileSubmitIntent } from "./profile-editor-types";

export default function ProfileSubmitButton({
  intent,
  hasChanges,
  idleLabel,
  pending,
  size = "md",
  className,
}: {
  intent: ProfileSubmitIntent;
  hasChanges: boolean;
  idleLabel: string;
  pending: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  if (!hasChanges) {
    return null;
  }

  return (
    <Button
      type="submit"
      name="intent"
      value={intent}
      variant="primary"
      size={size}
      className={className}
      icon="save"
      disabled={pending}
      loading={pending}
      loadingLabel="Saving..."
    >
      {idleLabel}
    </Button>
  );
}
