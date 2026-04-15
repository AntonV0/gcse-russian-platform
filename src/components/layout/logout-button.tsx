import { signOut } from "@/app/actions/auth";
import Button from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary" size="sm">
        Log out
      </Button>
    </form>
  );
}
