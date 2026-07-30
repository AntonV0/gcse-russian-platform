export function getTrialTierSuccessRedirectPath(isOnboarding: boolean) {
  return isOnboarding ? "/onboarding?step=profile" : "/dashboard?success=trial-started";
}

export function getExistingTrialTierRedirectPath(isOnboarding: boolean) {
  return isOnboarding ? "/onboarding?step=profile" : "/dashboard";
}
