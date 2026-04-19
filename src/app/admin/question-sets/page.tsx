import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getQuestionSetsDb } from "@/lib/questions/question-helpers-db";
import { appIcons } from "@/lib/shared/icons";

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

        <Button href="/admin/question-sets/create" variant="primary" icon="write">
          Create question set
        </Button>
      </div>

      {questionSets.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
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
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="muted" icon="file">
                        {questionSet.slug}
                      </Badge>
                    </div>

                    {questionSet.description ? (
                      <p className="text-gray-700">{questionSet.description}</p>
                    ) : null}

                    {questionSet.instructions ? (
                      <p className="text-gray-500">{questionSet.instructions}</p>
                    ) : null}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <AppIcon icon="preview" size={16} />
                      <span>Open question set</span>
                    </div>
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
