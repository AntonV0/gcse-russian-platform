"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Admin"
      title="The admin workspace hit a problem"
      description="The current admin view could not finish loading. You can retry the same view or return to the admin dashboard."
      primaryHref="/admin"
      primaryLabel="Admin dashboard"
      secondaryHref="/admin/content"
      secondaryLabel="Content"
      error={error}
      reset={reset}
    />
  );
}
