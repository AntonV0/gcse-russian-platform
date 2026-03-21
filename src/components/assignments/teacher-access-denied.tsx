import Link from "next/link";

export default function TeacherAccessDenied() {
  return (
    <main className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Access denied</h1>
      <p className="text-gray-600">
        You do not have permission to view this teacher page.
      </p>
      <Link
        href="/dashboard"
        className="inline-block rounded bg-black px-4 py-2 text-white"
      >
        Back to dashboard
      </Link>
    </main>
  );
}