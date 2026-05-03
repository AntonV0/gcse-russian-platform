import { signOut } from "@/app/actions/auth/auth";
import Button from "@/components/ui/button";
import type { ButtonVariant } from "@/components/ui/button-styles";

export default function LogoutButton({ variant = "exit" }: { variant?: ButtonVariant }) {
  return (
    <form action={signOut}>
      <Button type="submit" variant={variant} size="sm" icon="userX">
        Log out
      </Button>
    </form>
  );
}
