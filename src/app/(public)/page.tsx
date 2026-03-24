import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[70vh] items-center">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
          Private development build
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          GCSE Russian Course Platform
        </h1>

        <p className="mb-6 text-lg text-gray-600">
          A structured online learning platform for GCSE Russian with lessons, vocabulary,
          questions, and progress tracking.
        </p>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-black px-5 py-3 text-white hover:opacity-90"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
