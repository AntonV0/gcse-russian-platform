"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function ResourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Resources"
      title="This learning resource could not load"
      description="The resource page was interrupted while loading course data. Try again or return to the resources hub."
      primaryHref="/resources"
      primaryLabel="Resources"
      secondaryHref="/courses"
      secondaryLabel="Courses"
      error={error}
      reset={reset}
    />
  );
}
