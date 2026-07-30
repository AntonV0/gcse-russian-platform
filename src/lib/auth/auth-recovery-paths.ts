import { getSafeAuthRedirectPath } from "@/lib/auth/redirect-paths";

export function getFriendlyLoginErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login") ||
    normalized.includes("invalid credentials")
  ) {
    return "The email address or password was not recognised.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirm the account email before logging in.";
  }

  if (normalized.includes("rate") || normalized.includes("too many")) {
    return "Too many login attempts were made. Wait a few minutes, then try again.";
  }

  return "We could not reach the account service. Please try again in a moment.";
}

export function getForgotPasswordPath({
  error,
  success,
  source,
  next,
  returnTo,
}: {
  error?: string;
  success?: string;
  source?: string;
  next?: string | null;
  returnTo?: string | null;
}) {
  const params = new URLSearchParams();
  const safeNext = getSafeAuthRedirectPath(next);
  const safeReturnTo = getSafeAuthRedirectPath(returnTo);

  if (error) params.set("error", error);
  if (success) params.set("success", success);
  if (source === "app") params.set("from", "app");
  if (safeNext) params.set("next", safeNext);
  if (safeReturnTo) params.set("returnTo", safeReturnTo);

  return `/forgot-password${params.size ? `?${params.toString()}` : ""}`;
}

export function getPasswordSettingsPath({
  error,
  next,
  returnTo,
}: {
  error?: string;
  next?: string | null;
  returnTo?: string | null;
}) {
  const params = new URLSearchParams({ passwordReset: "1" });
  const safeNext = getSafeAuthRedirectPath(next);
  const safeReturnTo = getSafeAuthRedirectPath(returnTo);

  if (error) params.set("error", error);
  if (safeNext) params.set("next", safeNext);
  if (safeReturnTo) params.set("returnTo", safeReturnTo);

  return `/settings?${params.toString()}`;
}
