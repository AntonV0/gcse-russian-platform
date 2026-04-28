import { getCurrentProfile } from "@/lib/auth/auth";

export async function requireAdminAccess() {
  const profile = await getCurrentProfile();

  if (!profile?.is_admin) {
    return false;
  }

  return true;
}

export async function assertAdminAccess() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }
}
