import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getCoursesDb } from "@/lib/courses/course-helpers-db";

export default async function CoursesPage() {
  const courses = await getCoursesDb();

  return (
    <main className="space-y-8">
      <PageHeader
        title="Courses"
        description="Choose a course to begin or continue your GCSE Russian learning journey."
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info" icon="school">
              GCSE Russian
            </Badge>
            <Badge tone="muted" icon="layers">
              Foundation and Higher
            </Badge>
            <Badge tone="muted" icon="audio">
              Lessons, practice, progress
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="app-title max-w-3xl">Start or continue your course</h2>
            <p className="app-subtitle max-w-2xl">
              Structured GCSE Russian learning with lessons, listening practice,
              translation, and exam-style questions.
            </p>
          </div>
        </div>
      </section>

      {courses.length === 0 ? (
        <EmptyState
          icon="courses"
          iconTone="brand"
          title="No courses available yet"
          description="There are no visible courses right now. Return to your dashboard and check again later."
          action={
            <Button href="/dashboard" variant="primary" icon="dashboard">
              Dashboard
            </Button>
          }
        />
      ) : (
        <section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <DashboardCard className="h-full transition hover:scale-[1.01]">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>

                    <p className="text-sm app-text-muted">
                      {course.description || "Start learning this course."}
                    </p>

                    <div className="pt-2 text-sm font-medium app-brand-text">
                      Open course
                    </div>
                  </div>
                </DashboardCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
