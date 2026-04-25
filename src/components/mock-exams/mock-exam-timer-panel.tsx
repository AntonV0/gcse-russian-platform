"use client";

import { useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/badge";

type MockExamTimerPanelProps = {
  startedAt: string;
  timeLimitMinutes: number | null;
  isDraft: boolean;
};

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function MockExamTimerPanel({
  startedAt,
  timeLimitMinutes,
  isDraft,
}: MockExamTimerPanelProps) {
  const endsAt = useMemo(() => {
    if (!timeLimitMinutes) return null;
    return new Date(startedAt).getTime() + timeLimitMinutes * 60 * 1000;
  }, [startedAt, timeLimitMinutes]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt || !isDraft) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [endsAt, isDraft]);

  if (!endsAt) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Timing
            </div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              This mock exam is untimed.
            </div>
          </div>
          <Badge tone="muted" icon="pending">
            No limit
          </Badge>
        </div>
      </div>
    );
  }

  const remaining = endsAt - now;
  const isExpired = remaining <= 0;

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3",
        isExpired
          ? "border-[color-mix(in_srgb,var(--danger)_22%,transparent)] bg-[var(--danger-soft)]"
          : "border-[var(--border)] bg-[var(--background-muted)]",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
            Time remaining
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            {formatRemaining(remaining)}
          </div>
        </div>
        <Badge tone={isExpired ? "danger" : "warning"} icon="pending">
          {isExpired ? "Time elapsed" : `${timeLimitMinutes} minute limit`}
        </Badge>
      </div>
      {isExpired && isDraft ? (
        <p className="mt-3 text-sm leading-6 text-[var(--danger)]">
          The time limit has elapsed. Submit the attempt now so it can be reviewed.
        </p>
      ) : null}
    </div>
  );
}
