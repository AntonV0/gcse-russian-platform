"use client";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function VocabularyError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="space-y-4">
      <EmptyState
        icon="warning"
        iconTone="warning"
        title="Vocabulary did not load"
        description="Try again, or return to the vocabulary hub if the set is temporarily unavailable."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="secondary" icon="refresh" onClick={reset}>
              Try again
            </Button>
            <Button href="/vocabulary" variant="quiet" icon="vocabulary">
              Vocabulary hub
            </Button>
          </div>
        }
      />
    </main>
  );
}
