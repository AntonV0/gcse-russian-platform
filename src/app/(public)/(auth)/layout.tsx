import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardPath } from "@/lib/access/routes";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath());
  }

  return <>{children}</>;
}
