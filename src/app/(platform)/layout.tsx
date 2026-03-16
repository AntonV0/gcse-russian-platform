import Link from "next/link";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border bg-white p-4 shadow-sm">
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/courses" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Courses
          </Link>
          <Link href="/account" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Account
          </Link>
        </nav>
      </aside>

      <section>{children}</section>
    </div>
  );
}