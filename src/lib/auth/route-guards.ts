import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
