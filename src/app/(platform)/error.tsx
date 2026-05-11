"use client";

import RouteErrorPanel from "@/components/layout/route-error-panel";

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorPanel
      area="Platform"
      title="Your workspace could not load"
      description="Something interrupted this signed-in area. Try again, or return to the dashboard to keep going."
      primaryHref="/dashboard"
      primaryLabel="Dashboard"
      secondaryHref="/account"
      secondaryLabel="Account"
      error={error}
      reset={reset}
    />
  );
}
