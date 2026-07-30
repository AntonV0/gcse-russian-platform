import { getAppSiteUrl } from "@/lib/seo/site";
import { getPostOnboardingRedirectPath } from "@/lib/auth/redirect-paths";

export function getSignupOnboardingPath(destinationPath: string) {
  const destination = getPostOnboardingRedirectPath(destinationPath);
  return `/onboarding?next=${encodeURIComponent(destination)}`;
}

export function getSignupEmailRedirectUrl(destinationPath: string) {
  const callbackUrl = getAppSiteUrl("/auth/callback");
  callbackUrl.searchParams.set("next", getSignupOnboardingPath(destinationPath));
  return callbackUrl.toString();
}

export function getSignupConfirmationPath({
  destinationPath,
  source,
}: {
  destinationPath: string;
  source: "app" | "marketing" | "unknown";
}) {
  const params = new URLSearchParams({
    next: getPostOnboardingRedirectPath(destinationPath),
  });

  if (source === "app") {
    params.set("from", "app");
  }

  return `/signup/confirm-email?${params.toString()}`;
}
