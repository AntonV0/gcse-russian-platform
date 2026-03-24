import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getQuestionSetsDb } from "@/lib/question-helpers-db";

export default async function AdminQuestionSetsPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const questionSets = await getQuestionSetsDb();

  return (
    <main>
      <div className="mb-6 flex items-center justify-between gap-4">
        <PageHeader
          title="Question Sets"
          description="Manage reusable question sets for lessons and assignments."
        />

        <Link
          href="/admin/question-sets/create"
          className="inline-block rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          Create question set
        </Link>
      </div>

      {questionSets.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No question sets found.
        </div>
      ) : (
        <section className="grid gap-4">
          {questionSets.map((questionSet) => (
            <Link
              key={questionSet.id}
              href={`/admin/question-sets/${questionSet.id}`}
              className="block"
            >
              <div className="transition hover:-translate-y-0.5">
                <DashboardCard title={questionSet.title}>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Slug:</span> {questionSet.slug}
                    </p>

                    {questionSet.description ? (
                      <p className="text-gray-700">{questionSet.description}</p>
                    ) : null}

                    {questionSet.instructions ? (
                      <p className="text-gray-500">{questionSet.instructions}</p>
                    ) : null}
                  </div>
                </DashboardCard>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
