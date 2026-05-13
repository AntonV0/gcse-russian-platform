import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";

export function ProfileUpdatedInline() {
  return (
    <div className="rounded-lg border border-[var(--success-border)] bg-[var(--success-surface)] px-3.5 py-2.5 text-[var(--success-text)] shadow-[0_8px_18px_var(--success-shadow)]">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AppIcon icon="completed" size={16} strokeWidth={2.2} />
        Profile updated
      </div>
      <p className="mt-0.5 text-sm app-text-muted">
        Your saved name and avatar have been updated.
      </p>
    </div>
  );
}

export function ProfileActionErrorInline({ message }: { message: string }) {
  const shouldOfferLogin = message.toLowerCase().includes("log in");

  return (
    <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-surface)] px-3.5 py-2.5 text-[var(--danger-text)] shadow-[0_8px_18px_var(--danger-shadow)]">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AppIcon icon="warning" size={16} strokeWidth={2.2} />
        Profile update failed
      </div>
      <p className="mt-0.5 text-sm">{message}</p>
      {shouldOfferLogin ? (
        <div className="mt-3">
          <Button href="/login" variant="secondary" size="sm" icon="user">
            Log in
          </Button>
        </div>
      ) : null}
    </div>
  );
}
