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
