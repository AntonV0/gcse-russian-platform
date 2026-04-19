"use client";

import { signOut } from "@/app/actions/auth/auth";
import Button from "@/components/ui/button";
import { appIcons } from "@/lib/shared/icons";

export default function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="danger" size="sm" icon="userX">
        Log out
      </Button>
    </form>
  );
}
