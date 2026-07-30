export function getSafeAuthRedirectPath(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  if (trimmed.includes("\\") || /[\r\n]/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function getAuthRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard"
) {
  return getSafeAuthRedirectPath(value) ?? fallback;
}

const AUTH_AND_ONBOARDING_PATHS = new Set([
  "/login",
  "/signup",
  "/signup/confirm-email",
  "/forgot-password",
  "/onboarding",
  "/auth/callback",
]);

export function getPostOnboardingRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard"
) {
  const safePath = getSafeAuthRedirectPath(value);

  if (!safePath) {
    return fallback;
  }

  const pathname = safePath.split(/[?#]/, 1)[0];

  return AUTH_AND_ONBOARDING_PATHS.has(pathname) ? fallback : safePath;
}

export function appendAuthDestination(href: string, pathname: string | null) {
  if (!pathname || !href.includes("from=app")) {
    return href;
  }

  const url = new URL(href, "https://gcserussian.local");

  if (url.pathname !== "/signup" && url.pathname !== "/login") {
    return href;
  }

  if (!url.searchParams.has("next")) {
    url.searchParams.set("next", pathname);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function appendSignupDestination(href: string, pathname: string | null) {
  return appendAuthDestination(href, pathname);
}
