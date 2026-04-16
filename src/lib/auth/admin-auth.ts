import { getCurrentProfile } from "@/lib/auth/auth";

export async function requireAdminAccess() {
  const profile = await getCurrentProfile();

  if (!profile?.is_admin) {
    return false;
  }

  return true;
}
