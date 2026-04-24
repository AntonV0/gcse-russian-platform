import { getCurrentProfile } from "@/lib/auth/auth";

export async function isCurrentUserAdminDb() {
  const profile = await getCurrentProfile();

  return Boolean(profile?.is_admin);
}
