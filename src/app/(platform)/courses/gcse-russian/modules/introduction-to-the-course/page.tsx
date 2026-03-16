import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function IntroductionModulePage() {
  return (
    <main>
      <PageHeader
        title="Introduction to the course"
        description="A sample module showing how modules and lessons will be structured."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/courses/gcse-russian/lessons/how-the-course-works"
          className="block"
        >
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Lesson 1: How the course works">
              Overview of navigation, lesson flow, and study structure.
            </DashboardCard>
          </div>
        </Link>

        <DashboardCard title="Lesson 2: Getting started">
          Placeholder for the next lesson in this module.
        </DashboardCard>
      </section>
    </main>
  );
}