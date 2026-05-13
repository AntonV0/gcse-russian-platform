"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Lesson"
      title="This lesson could not load"
      description="The lesson was interrupted while loading content and progress. Try again, or return to your courses and reopen it."
      primaryHref="/courses"
      primaryLabel="Courses"
      secondaryHref="/dashboard"
      secondaryLabel="Dashboard"
      error={error}
      reset={reset}
    />
  );
}
