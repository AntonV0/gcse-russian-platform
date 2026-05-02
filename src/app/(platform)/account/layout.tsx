import type { Metadata } from "next";
import { requireAuthenticatedUser } from "@/lib/auth/route-guards";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticatedUser();

  return <>{children}</>;
}
