import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function GcseRussianCoursePage() {
  return (
    <main>
      <PageHeader
        title="GCSE Russian"
        description="Structured lessons, vocabulary, and exam practice for GCSE Russian."
      />

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <DashboardCard title="Course overview">
          This course will contain modules, lessons, revision tools, and exam
          skills practice.
        </DashboardCard>

        <DashboardCard title="Status">
          Early development build with placeholder content.
        </DashboardCard>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Modules</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/courses/gcse-russian/modules/introduction-to-the-course"
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-black"
          >
            <h3 className="mb-2 font-semibold">Introduction to the course</h3>
            <p className="text-sm text-gray-600">
              A starting point for how the platform and course will work.
            </p>
          </Link>

          <Link
            href="/courses/gcse-russian/modules/family-and-relationships"
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-black"
          >
            <h3 className="mb-2 font-semibold">Family and relationships</h3>
            <p className="text-sm text-gray-600">
              Example topic module for GCSE Russian content structure.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}