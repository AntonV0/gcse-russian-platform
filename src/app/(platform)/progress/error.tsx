"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function ProgressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Progress"
      title="Progress could not load"
      description="Something interrupted your progress summary. Try again, or return to the dashboard and continue from there."
      primaryHref="/dashboard"
      primaryLabel="Dashboard"
      secondaryHref="/courses"
      secondaryLabel="Courses"
      error={error}
      reset={reset}
    />
  );
}
