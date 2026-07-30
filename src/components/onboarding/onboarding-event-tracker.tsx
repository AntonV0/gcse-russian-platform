"use client";

import { useEffect } from "react";
import type { OnboardingFunnelEventName } from "@/lib/onboarding/funnel-events";

export default function OnboardingEventTracker({
  eventName,
  source,
  entryPath,
  destinationPath,
  onlyExistingJourney = false,
}: {
  eventName: OnboardingFunnelEventName;
  source?: string;
  entryPath?: string;
  destinationPath?: string;
  onlyExistingJourney?: boolean;
}) {
  useEffect(() => {
    void fetch("/api/onboarding-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName,
        source,
        entryPath,
        destinationPath,
        onlyExistingJourney,
      }),
      keepalive: true,
    });
  }, [destinationPath, entryPath, eventName, onlyExistingJourney, source]);

  return null;
}
