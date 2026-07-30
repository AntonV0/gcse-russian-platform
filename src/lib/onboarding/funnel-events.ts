import { cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const ONBOARDING_JOURNEY_COOKIE = "onboarding_journey_id";

export type OnboardingFunnelEventName =
  | "signup_viewed"
  | "signup_submitted"
  | "account_created"
  | "tier_viewed"
  | "tier_selected"
  | "profile_viewed"
  | "profile_saved"
  | "profile_skipped"
  | "dashboard_arrived"
  | "first_lesson_opened";

export function getOrCreateOnboardingJourneyId(): Promise<string>;
export function getOrCreateOnboardingJourneyId(options: {
  create?: true;
}): Promise<string>;
export function getOrCreateOnboardingJourneyId(options: {
  create: false;
}): Promise<string | null>;
export async function getOrCreateOnboardingJourneyId({
  create = true,
}: {
  create?: boolean;
} = {}) {
  const cookieStore = await cookies();
  const existing = cookieStore.get(ONBOARDING_JOURNEY_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  if (!create) {
    return null;
  }

  const journeyId = crypto.randomUUID();
  cookieStore.set(ONBOARDING_JOURNEY_COOKIE, journeyId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return journeyId;
}

export async function trackOnboardingFunnelEvent({
  journeyId,
  eventName,
  userId,
  source,
  entryPath,
  destinationPath,
  selectedTier,
}: {
  journeyId: string;
  eventName: OnboardingFunnelEventName;
  userId?: string | null;
  source?: string | null;
  entryPath?: string | null;
  destinationPath?: string | null;
  selectedTier?: "foundation" | "higher" | null;
}) {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("onboarding_funnel_events").upsert(
      {
        journey_id: journeyId,
        event_name: eventName,
        user_id: userId ?? null,
        source: source?.slice(0, 32) ?? null,
        entry_path: entryPath?.slice(0, 500) ?? null,
        destination_path: destinationPath?.slice(0, 500) ?? null,
        selected_tier: selectedTier ?? null,
      },
      {
        onConflict: "journey_id,event_name",
        ignoreDuplicates: true,
      }
    );

    if (error) {
      console.warn("Onboarding funnel event could not be saved.", {
        eventName,
        error,
      });
    }
  } catch (error) {
    console.warn("Onboarding funnel event could not be saved.", {
      eventName,
      error,
    });
  }
}
