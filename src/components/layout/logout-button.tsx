import { signOut } from "@/app/actions/auth";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/icons";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="danger" size="sm" icon={appIcons.userX}>
        Log out
      </Button>
    </form>
  );
}
