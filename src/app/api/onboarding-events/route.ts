import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getOrCreateOnboardingJourneyId,
  trackOnboardingFunnelEvent,
  type OnboardingFunnelEventName,
} from "@/lib/onboarding/funnel-events";

const browserEvents = new Set<OnboardingFunnelEventName>([
  "signup_viewed",
  "tier_viewed",
  "profile_viewed",
  "dashboard_arrived",
  "first_lesson_opened",
]);

function safeString(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.slice(0, maxLength) : null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid event payload." }, { status: 400 });
  }

  const eventName = safeString(body.eventName, 64) as OnboardingFunnelEventName | null;

  if (!eventName || !browserEvents.has(eventName)) {
    return NextResponse.json({ message: "Unsupported event." }, { status: 400 });
  }

  const onlyExistingJourney = body.onlyExistingJourney === true;
  const journeyId = onlyExistingJourney
    ? await getOrCreateOnboardingJourneyId({ create: false })
    : await getOrCreateOnboardingJourneyId();

  if (!journeyId) {
    return new NextResponse(null, { status: 204 });
  }

  const user = await getCurrentUser();
  await trackOnboardingFunnelEvent({
    journeyId,
    eventName,
    userId: user?.id,
    source: safeString(body.source, 32),
    entryPath: safeString(body.entryPath),
    destinationPath: safeString(body.destinationPath),
  });

  return new NextResponse(null, { status: 204 });
}
