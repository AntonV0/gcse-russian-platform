"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Dashboard"
      title="We could not load your dashboard"
      description="Your account and course data are safe. Try again, or open courses while the dashboard refreshes."
      primaryHref="/courses"
      primaryLabel="Open courses"
      secondaryHref="/past-papers"
      secondaryLabel="Past papers"
      error={error}
      reset={reset}
    />
  );
}
