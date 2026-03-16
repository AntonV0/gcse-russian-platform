import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          GCSE Russian Course Platform
        </h1>

        <p className="mb-6 text-gray-600">
          Project setup is working.
        </p>

        <Link
          href="/dashboard"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}