import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";

function getOnboardingPath({
  step,
  error,
  next,
  tier,
}: {
  step?: "profile";
  error?: string;
  next?: string | null;
  tier?: "foundation" | "higher" | null;
}) {
  const params = new URLSearchParams();

  if (step) {
    params.set("step", step);
  }

  if (error) {
    params.set("error", error);
  }

  if (tier) {
    params.set("tier", tier);
  }

  params.set("next", getPostOnboardingRedirectPath(next));
  return `/onboarding?${params.toString()}`;
}

export function getTrialTierSuccessRedirectPath(
  isOnboarding: boolean,
  next?: string | null
) {
  return isOnboarding
    ? getOnboardingPath({ step: "profile", next })
    : "/dashboard?success=trial-started";
}

export function getExistingTrialTierRedirectPath(
  isOnboarding: boolean,
  next?: string | null
) {
  return isOnboarding ? getOnboardingPath({ step: "profile", next }) : "/dashboard";
}

export function getTrialTierErrorRedirectPath(
  isOnboarding: boolean,
  error: string,
  next?: string | null,
  tier?: "foundation" | "higher" | null
) {
  return isOnboarding
    ? getOnboardingPath({ error, next, tier })
    : `/dashboard?error=${encodeURIComponent(error)}`;
}
