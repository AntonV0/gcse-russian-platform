import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/layout/logout-button";

export const metadata: Metadata = {
  title: "GCSE Russian Course Platform",
  description: "Online GCSE Russian learning platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              GCSE Russian
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-black">
                Home
              </Link>
              <Link href={getDashboardPath()} className="text-gray-600 hover:text-black">
                Dashboard
              </Link>
              <Link href={getCoursesPath()} className="text-gray-600 hover:text-black">
                Courses
              </Link>
              <Link href={getAccountPath()} className="text-gray-600 hover:text-black">
                Account
              </Link>

              {user ? (
                <>
                  <span className="text-gray-500">{user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-black">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-gray-600 hover:text-black">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <div className="px-6 py-8 md:px-8">{children}</div>
      </body>
    </html>
  );
}
