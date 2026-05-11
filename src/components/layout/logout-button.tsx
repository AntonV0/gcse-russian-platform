import { signOut } from "@/app/actions/auth/auth";
import LoadingButton from "@/components/ui/loading-button";
import type { ButtonVariant } from "@/components/ui/button-styles";

export default function LogoutButton({
  variant = "exit",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <form action={signOut}>
      <LoadingButton
        idleLabel="Log out"
        pendingLabel="Logging out..."
        variant={variant}
        size="sm"
        idleIcon="userX"
        className={className}
      />
    </form>
  );
}
