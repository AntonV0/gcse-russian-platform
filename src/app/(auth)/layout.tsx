import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PublicAccentOverride from "@/components/providers/public-accent-override";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardPath } from "@/lib/access/routes";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath());
  }

  return (
    <>
      <PublicAccentOverride />
      {children}
    </>
  );
}
