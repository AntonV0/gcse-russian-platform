import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/layout/logout-button";
import PageContainer from "@/components/layout/page-container";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/access/routes";
import { getCurrentUser } from "@/lib/auth/auth";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PageContainer>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border bg-white p-4 shadow-sm">
          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href={getDashboardPath()}
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href={getCoursesPath()}
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Courses
            </Link>
            <Link
              href={getAccountPath()}
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              Account
            </Link>
          </nav>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </aside>

        <section>{children}</section>
      </div>
    </PageContainer>
  );
}
